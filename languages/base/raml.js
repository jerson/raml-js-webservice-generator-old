var S = require('string'),
    schemaParser = require('./parser/schema');


/**
 *
 * @param ast
 * @returns {{}}
 */
exports.parse = function (ast) {
    var schemas = {};

    ast.schemas.forEach(function (data) {

        var keys = Object.keys(data);
        var tableName = keys[0] ? keys[0] : '';
        schemas[tableName] = schemaParser.parse(data[tableName]);

    });

    return schemas;
};


/**
 * {
    "relativeUri": "/{newsId}",
    "methods": [
      {
        "responses": {
        },
        "method": "get"
      }
    ],
    "relativeUriPathSegments": [
      "{newsId}"
    ],
    "uriParameters": {
      "newsId": {
        "type": "string",
        "required": true,
        "displayName": "newsId"
      }
    },
    "parentRelativeUri": "/news",
    "groupRelatativeUri": "/news",
    "name": "news"
  }


 * @param ast
 * @param resources
 * @returns {*}
 */
exports.resources = function (ast, resources) {

    if (!resources) {
        resources = [];
    }

    ast.resources.forEach(function (value) {

        value.parentRelativeUri = ast.parentRelativeUri ? ast.parentRelativeUri : '';
        value.parentRelativeUri += ast.relativeUri ? ast.relativeUri : '';

        value.groupRelatativeUri = ast.groupRelatativeUri ? ast.groupRelatativeUri : '';
        if (!value.groupRelatativeUri) {
            value.groupRelatativeUri = ast.relativeUri ? ast.relativeUri : value.relativeUri;
            value.groupRelatativeUri = S(value.groupRelatativeUri).replace(/\//g, ' ').dasherize().slugify().s;
        }

        value.name = S(value.groupRelatativeUri).capitalize().camelize().s;


        value.methods = exports.methods(value);

        resources.push(value);
        if (value.resources) {
            exports.resources(value, resources);
        }
    });

    //console.log(JSON.stringify(resources, null, 2));
    return resources;
};

/**
 *
 * @param ast
 * @returns {{}}
 */
exports.resourcesGroups = function (ast) {

    var resources = exports.resources(ast);
    var groups = {};

    resources.forEach(function (resource) {

        if (!groups[resource.name]) {
            groups[resource.name] = [];
        }

        groups[resource.name].push(resource);

    });

    return groups;
};

/**
 *
 * @param resource
 * @returns {*}
 */
exports.methods = function (resource) {

    resource.methods.forEach(function (method, index) {


        switch (method.method) {
            case 'get':
                method.action = 'show';
                break;
            case 'post':
                method.action = 'create';
                break;
            case 'put':
                method.action = 'update';
                break;
            case 'delete':
                method.action = 'delete';
                break;
            default:
                method.action = 'index';
                break;
        }

        resource.methods[index] = method;

    });

    return resource.methods;
};