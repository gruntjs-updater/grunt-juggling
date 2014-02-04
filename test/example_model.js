exports.model = function (schema) {
    schema.define("Test1", {
        key: { type: String },
        value: { type: String }
    }, {
        table: "tests1"
    });

    schema.define("Test2", {
        key: { type: String },
        value: { type: String }
    }, {
        table: "tests2"
    });
};
