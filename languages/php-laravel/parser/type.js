var util = require('util'),
    keysParser = require('../parser/type'),
    schemaParser = require('../../base/parser/schema');


exports.foreignType = function (property, schemas) {

    var fallbackType = 'INT(11)';

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
        var values = [];
        property.enum.forEach(function (value) {
            values.push(util.format('\'%s\'', value));
        });

        type = util.format('ENUM (%s)', values.toString());
    }

    if (type) {
        return type;
    }

    var length = exports.length(property);

    switch (property.type) {
        case 'string':
            type = util.format('VARCHAR(%d)', length);
            break;
        case 'number':
            type = 'DOUBLE';
            break;
        case 'integer':
            type = util.format('INT(%d)', length > 11 ? 11 : length);
            break;
        case 'boolean':
            type = 'TINYINT(1)';
            break;
        case 'object':
            type = exports.foreignType(property, schemas);
            break;
        case 'array':
            //TODO agregar soporte para arrays
            type = 'VARCHAR(250)';
            break;
        case 'null':
            type = 'CHAR(1)';
            break;
        case 'any':
            type = 'TEXT';
            break;

        //FIXME estos no son estandares JSON SCHEMA
        case 'text':
            type = 'TEXT';
            break;
        case 'date':
            type = 'DATE';
            break;
        case 'datetime':
            type = 'DATETIME';
            break;
        case 'time':
            type = 'TIME';
            break;
        case 'timestamp':
            type = 'TIMESTAMP';
            break;
        case 'file':
            type = 'VARCHAR(250)';
            break;
        default:
            type = 'VARCHAR(250)';
            break;
    }


    return type;
};