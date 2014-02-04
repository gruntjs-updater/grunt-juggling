/*
 * grunt-juggling
 * https://github.com/CKing/grunt-juggling
 *
 * Copyright (c) 2014 Christopher König
 * Licensed under the MIT license.
 */

'use strict';
var existsSync = require("fs").existsSync || require("path").existsSync;
var join = require("path").join;

var async = require("async");
var Schema = require("jugglingdb").Schema;

var valid = function (val) {
    return !(val === null || !val || val.length === 0);
};

var Juggling = function (grunt, task) {
    this.grunt = grunt;
    this.task = task;
};
var C = Juggling.prototype;

C.log = function (msg, verbose) {
    if (typeof verbose === "undefined") {
        verbose = true;
    }

    if (!verbose) {
        this.grunt.log.writeln(msg);
    } else {
        this.grunt.verbose.writeln(msg);
    }
};

C.getJugglingLib = function () {
    var expansion = this.grunt.file.expand("./**/node_modules/jugglingdb/lib");
    if (expansion.length >= 1) {
        return join(process.cwd(), expansion[0]);
    } else {
        return this.grunt.fatal("JugglingDB not found!");
    }
};

C.hasSchemaAdapter = function (adapter) {
    var juggling = this.getJugglingLib();

    if (typeof adapter === 'object') {
        return true;
    } else {
        if (!adapter.match(/^\//)) {
            if (existsSync(juggling + '/adapters/' + adapter + '.js')) {
                adapter = juggling + '/adapters/' + adapter;
            } else {
                adapter = 'jugglingdb-' + adapter;
            }
        }
    }

    try {
        require.resolve(adapter);
        return true;
    } catch (e) {
        return false;
    }
};

C.readModels = function () {
    var self = this;
    var models = this.task.data.models || [];

    this.schemas = [];

    models.forEach(function (model) {
        model = self.grunt.file.expand(model);
        model.forEach(function (parsedModel) {
            if (0 >= self.schemas.indexOf(parsedModel)) {
                self.schemas.push({
                    name: parsedModel,
                    instance: require(join(process.cwd(), parsedModel))
                });
            }
        });
    });

    this.hasSchemas = this.schemas.length > 0;
    if (!this.hasSchemas) {
        this.grunt.warn("No models found!");
    }
};

C.parseOptions = function () {
    var options = this.task.options({
        driver: "memory",
        driver_options: {}
    });

    this.log("Initialize " + options.driver + " juggling schema driver...");
    if (this.hasSchemaAdapter(options.driver)) {
        this.schema = new Schema(options.driver, options.driver_options);
    } else {
        this.grunt.fatal("Juggling schema driver " + options.driver + " not found!");
    }

    this.log("Read available models...");
    this.readModels();
};

C.importModels = function () {
    var self = this;
    var imp = this.task.data.import_model;

    this.log("Importing models...");
    if (!imp) {
        this.grunt.fatal("Cannot import models!");
    }

    this.schema.on("define", function (model, name) {
        self.models[name.toLowerCase()] = model;
    });

    this.models = {};
    this.schemas.forEach(function (model) {
        imp(model.instance, self.schema);
    });
};

C.buildRelationship = function () {
    var self = this;
    var rel = this.task.data.import_relationship;

    this.log("Importing relationships...");
    if (!rel) {
        this.log("No relationships to import.");
        return;
    }

    this.models.forEach(function (model) {
        rel(model, self.schema);
    });
};

C.buildTables = function (done) {
    var self = this;

    this.schema.isActual(function (err, isActual) {
        if ((!!err && err.length > 0) || isActual) {
            self.schema.autoupdate(done);
        } else {
            done();
        }
    });
};

C.loadFixtures = function (fixtures, done) {
    var self = this;

    if (!fixtures.length) {
        done();
        return;
    }

    this.log("Loading fixtures...");
    var callbacks = [];
    fixtures.forEach(function (fixture) {
        fixture = self.grunt.file.expand(fixture);
        fixture.forEach(function (file) {
            var content = [];

            if (self.grunt.file.isMatch("**/*.json", file)) {
                content = self.grunt.file.readJSON(file);
            } else if (self.grunt.file.isMatch("**/*.json", file)) {
                content = self.grunt.file.readYAML(file);
            } else {
                self.grunt.fatal("Could not detect file format!");
            }


            content.forEach(function (table) {
                var target = self.models[table.table.toLowerCase()];
                var data = table.data;

                data.forEach(function (entry) {
                    callbacks.push(function (done) {
                        target.create(entry, function (err) {
                            return done(err);
                        });
                    });
                });
            });
        });
    });

    async.series(callbacks, function (err, res) {
        if(!!err) {
            throw err;
        }

        self.log("Done!");
        done();
    });
};

C.importFixtures = function (done) {
    var self = this;
    var fixtures = this.task.data.fixtures;

    if ("undefined" === typeof fixtures) {
        // no fixtures given
        done();
        return;
    }

    this.log("Cleaning all tables...");
    var callbacks = Object.keys(this.models).map(function (name) {
        return function (done) {
            self.models[name].destroyAll(function () {
                done();
            });
        };
    });

    // empty all tables
    async.parallel(callbacks, function (err, res) {
        if(!!err) {
            throw err;
        }

        if (fixtures.length === 0) {
            done();
        } else {
            // import all fixtures
            self.loadFixtures(fixtures, done);
        }
    });
};

module.exports = function (grunt) {
    grunt.registerMultiTask('juggling', 'Grunt plugin to create jugglingdb database structure and import fixtures.', function () {
        var done = this.async();

        var juggling = module.exports[this.nameArgs] = new Juggling(grunt, this);
        juggling.parseOptions();

        if (!juggling.hasSchemas) {
            return;
        }

        juggling.importModels();
        juggling.buildRelationship();

        // now comes the async part
        juggling.buildTables(function () {
            juggling.importFixtures(done);
        });
    });
};
