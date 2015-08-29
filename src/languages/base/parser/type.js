var util = require('util'),
    keysParser = require('../parser/type'),
    schemaParser = require('../../base/parser/schema');

exports.foreignType = function (property, schemas) {

    var fallbackType = 'integer';

    var propertyReferenced = property.ref;
    if (schemas.hasOwnProperty(propertyReferenced)) {

        var schemaReferenced = schemaParser.parse(schemas[propertyReferenced]);
        if (schemaReferenced.properties) {
            Object.keys(schemaReferenced.properties).forEach(function (name) {

                var property = schemaReferenced.properties[name];
                if (property.primary) {
                    propertyReferenced = property;
                    return true;
                }

            });
        }

        if (!propertyReferenced) {
            return fallbackType;
        }

        return exports.type(propertyReferenced, schemas);
    } else {
        return fallbackType;
    }

};

exports.length = function (property) {
    return property.maximum ? property.maximum.toString().length : 255;
};


exports.type = function (property, schemas) {

    var type = '';

    if (property.enum) {
        return 'string';
    }

    var length = exports.length(property);

    switch (property.type) {
        case 'string':
            type = 'string';
            break;
        case 'number':
            type = 'integer';
            break;
        case 'integer':
            type = 'integer';
            break;
        case 'boolean':
            type = 'boolean';
            break;
        case 'object':
            type = exports.foreignType(property, schemas);
            break;
        case 'array':
            type = 'array';

            break;
        case 'null':
            type = 'string';
            break;
        case 'any':
            type = 'string';
            break;

        //FIXME estos no son estandares JSON SCHEMA
        case 'text':
            type = 'string';
            break;
        case 'date':
            type = 'datetime';
            break;
        case 'datetime':
            type = 'datetime';
            break;
        case 'time':
            type = 'datetime';
            break;
        case 'timestamp':
            type = 'datetime';
            break;
        case 'file':
            type = 'string';
            break;
        default:
            type = 'string';
            break;
    }


    return type;
};