var S = require('string'),
    schemaParser = require('./parser/schema');

/**
 *
 * @param ast
 * @returns {{}} associative array containing all the tables parsed
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
 * Extracts the resources with additional relativeUri properties
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


 * @param ast the raml object
 * @param resources
 * @returns [] array containing
 */
exports.resources = function (ast, resources) {
    // TODO comment the inner workings of this function
    if (!resources) {
        resources = [];
    }

    ast.resources.forEach(function (value) {

        value.parentRelativeUri = ast.parentRelativeUri ? ast.parentRelativeUri : '';
        value.parentRelativeUri += ast.relativeUri ? ast.relativeUri : '';

        value.groupRelativeUri = ast.groupRelativeUri ? ast.groupRelativeUri : '';
        if (!value.groupRelativeUri) {
            value.groupRelativeUri = ast.relativeUri ? ast.relativeUri : value.relativeUri;

            var baseName = '';
            baseName = value.groupRelativeUri.split('/');
            value.groupRelativeUri = baseName[1] ? baseName[1] : baseName[0];
            value.groupRelativeUri = S(value.groupRelativeUri).replace(/\//g, ' ').dasherize().slugify().s;

            value.suffixRelativeUri = baseName.length > 1 ? baseName.join('/') : '';
        }

        value.name = S(value.groupRelativeUri).capitalize().camelize().s;

        value.suffixRelativeUri = ast.relativeUri ? ast.relativeUri : value.suffixRelativeUri;
        value.suffixRelativeUri = value.suffixRelativeUri.replace(value.groupRelativeUri, '');
        value.suffixRelativeUri = S(value.suffixRelativeUri).replace(/\//g, ' ').dasherize().slugify().s;
        value.suffix = S(value.suffixRelativeUri).capitalize().camelize().s;

        value.methods = exports.methods(value);

        resources.push(value);
        if (value.resources) {
            exports.resources(value, resources);
        }
    });

    return resources;
};

/**
 *
 * @param ast the raml object
 * @returns {Array}
 */
exports.resourceGroups = function (ast) {
    var resources = exports.resources(ast);
    return exports.resourceGroupsFromResources(resources);
};

/**
 * Groups resources by name
 * @param resources
 * @returns {[{name:"...",resources:[{}]}]} array of resource groups
 */
exports.resourceGroupsFromResources = function (resources) {
    var groupsKeys = {};
    var groups = [];

    resources.forEach(function (resource) {

        if (!groupsKeys[resource.name]) {
            groupsKeys[resource.name] = [];
        }

        groupsKeys[resource.name].push(resource);

    });

    Object.keys(groupsKeys, function (groupName, groupResources) {

        var group = {
            resources: groupResources,
            name: groupName
        };

        groups.push(group);
    });

    return groups;
};

/**
 * Sets the action variable of each method acording to it's method property
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