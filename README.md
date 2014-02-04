# grunt-juggling

> Grunt plugin to create jugglingdb database structure and import fixtures.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-juggling --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-juggling');
```

## The "juggling" task

### Overview
In your project's Gruntfile, add a section named `juggling` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  juggling: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.driver
Type: `String`
Default value: `'memory'`

The driver for jugglingdb to use, same format as in jugglingdb itself

#### options.punctuation
Type: `Object`
Default value: `'{}'`

The driver options for jugglingdb to use, same format as in jugglingdb itself

#### models
Type: `Array`
Default value: `'[]'`

List every file that contains a model. Should be callable via import_model

#### fixtures
Type: `Array`
Default value: `'null'`

Either null (default) to disable import of fixtures, an empty array to clear tables or an array with files in json or yaml format. Details see below

#### import_model
Type: `Function`
Default value: `'null'`

The function to import the models. Callback is `function (module, schema)`.

### Usage Examples

#### Default Options
In this example, the default options are used to do nothing.

```js
grunt.initConfig({
  juggling: {
    options: {},
    import_model: function (module, schema) {
      module(schema);
    },
  },
});
```

#### Custom Options
In this example, custom options are used to import fixtures. Juggling is used with MySQL adapter.

```js
grunt.initConfig({
  juggling: {
    options: {
      driver: 'mysql',
      driver_options: {
      	host: "localhost",
      	username: "root",
      	password: "NotSoSecret",
      	database: "databasename"
      },
    },
	models: [
		'models/**/*_model.js'
	],
	fixtures: [
		'fixtures/**/*_fixture.json'
	],
	import_model: function (module, schema) {
		module.model(schema);
	}
  },
});
```

### Fixtures file format
Following formats are supported with `.json` extension:
```json
[
    {
        "table": "tableName",
        "data": [
            {"key": "value", "store": "of"},
            {"parameters": "toInsert"}
        ]
    }
]
```

For `.yaml` format, just port the `.json` format.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
