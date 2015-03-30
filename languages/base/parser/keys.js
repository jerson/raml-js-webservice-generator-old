var schemaParser = require('./schema'),
    util = require('util');

exports.foreignKeys = function (schema, schemas) {

    var keys = {};
    var properties = schema.properties ? schema.properties : {};

    Object.keys(properties).forEach(function (name) {

        var foreignKey = exports.foreignKey(name, schema, schemas);
        if (foreignKey) {
            keys[name] = foreignKey;
        }

    });

    return keys;
};

exports.foreignKey = function (name, schema, schemas) {

    var property = schema.properties[name];
    if (property.type === 'object' && property.ref) {


        var propertyReferenced = property.ref;
        if (!schemas[propertyReferenced]) {
            console.error(util.format('[%s] schema no encontrado', propertyReferenced));
            return false;
        }

        var schemaReferenced = schemaParser.parse(schemas[propertyReferenced]);
        if (schemaReferenced) {
            property.refObject = exports.firstPrimaryKey(schemaReferenced);

        }

    }

    return property;
};

exports.uniqueKeys = function (schema) {

    var keys = {};
    var properties = schema.properties ? schema.properties : {};

    Object.keys(properties).forEach(function (name) {

        var uniqueKey = exports.uniqueKey(name, schema);
        if (uniqueKey) {
            keys[name] = uniqueKey;
        }

    });

    return keys;
};

exports.uniqueKey = function (name, schema) {

    var property = schema.properties[name];
    if (property.uniqueItems || property.unique) {
        return property;
    }

    return null;
};

exports.primaryKeys = function (schema) {

    var keys = {};

    Object.keys(schema.properties).forEach(function (name) {

        var primaryKey = exports.primaryKey(name, schema);
        if (primaryKey) {
            keys[name] = primaryKey;
        }

    });


    //if (!primary.length && keys.length) {
    //    primary.push(keys[0]);
    //}

    return keys;
};

exports.primaryKey = function (name, schema) {

    var property = schema.properties[name];
    if (property.primary) {
        return property;
    }

    return null;
};

exports.firstPrimaryKey = function (schema) {
    var keys = exports.primaryKeys(schema);
    var keysValues = Object.keys(keys);
    var keyName = keysValues && keysValues.length ? keysValues[0] : null;

    var primaryObject = null;
    if (keyName) {
        primaryObject = {};
        primaryObject[keyName] = keys[keyName];
    }

    return primaryObject;
};