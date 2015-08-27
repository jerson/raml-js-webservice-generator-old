/**
 * Generates source file from RAML
 */

var swig = require('swig'),
    util = require('util'),
    string = require('string'),
    raml = require('../base/raml'),
    schemaParser = require('../base/parser/schema'),
    keysParser = require('../base/parser/keys');

/**
 * Renders the params into the swings templates
 * @param file path of the output file
 * @param params template variables to pass to the template
 * @returns {*}
 */
var render = function (file, params) {
    return swig.renderFile(util.format('%s/template/%s.swig', __dirname, file), params);
};

module.exports = {
    /**
     * Generate the files to output by inserting the RAML data in the templates
     * @param RAMLObject
     * @param options
     * @returns {{files: {web: {}, src: {Controllers: {}, Models: {}, Views: {}}, raml: {}}}}
     */
    generate: function (RAMLObject, options) {
        var files = {
            bin: {},
            config: {},
            raml: {},
            src: {
                Controller: {},
                Entity: {},
                Form: {
                    Extensions: {
                        Doctrine: {
                            Bridge: {}
                        }
                    }
                },
                views: {}
            },
            var: {
                cache: {},
                logs: {}
            },
            web: {}
        };

        var resources = raml.resources(RAMLObject);
        var schemas = raml.schemas(RAMLObject);
        var resourceGroups = raml.resourceGroupsFromResources(resources);

        // Dumps the variables to raml/
        files.raml['RAML.json'] = JSON.stringify(RAMLObject, null, 2);
        files.raml['RAML-resources.json'] = JSON.stringify(resources, null, 2);
        files.raml['RAML-resourceGroups.json'] = JSON.stringify(resourceGroups, null, 2);

        // Render the index.php file
        files['composer.json'] = render('composer.json');

        files.bin.console = render('bin/console');

        files.config['dev.php'] = render('config/dev.php');
        files.config['prod.php'] = render('config/prod.php');

        files.var.cache['.gitignore'] = render('var/cache/.gitignore');
        files.var.logs['.gitignore'] = render('var/logs/.gitignore');

        files.src.Form.Extensions.Doctrine.Bridge['ManagerRegistry.php'] = render('src/Form/Extensions/Doctrine/Bridge/ManagerRegistry.php');

        files.web['index.php'] = render('web/index.php', {resources: resources, resourceGroups: resourceGroups});
        files.web['index_dev.php'] = render('web/index_dev.php', {
            resources: resources,
            resourceGroups: resourceGroups
        });
        files.web['.htaccess'] = render('web/.htaccess', {resources: resources, resourceGroups: resourceGroups});


        files.src['console.php'] = render('src/console.php', {resources: resources, resourceGroups: resourceGroups});
        files.src['routes.php'] = render('src/routes.php', {resources: resources, resourceGroups: resourceGroups});
        files.src['app.php'] = render('src/app.php', {resources: resources, resourceGroups: resourceGroups});

        // Render each *Controller.php file
        resourceGroups.forEach(function (group) {
            files.src.Controller[util.format('%sController.php', group.name)] = render('src/Controllers/controller.php', {
                group: group
            });
        });

        Object.keys(schemas).forEach(function (name) {
            var schema = schemas[name];
            var fileName = string('_'+name).camelize().s;
            files.src.Entity[util.format('%s.php', fileName)] = render('src/Entity/entity.php', {
                schema: schema,
                schemas: schemas,
                name: name
            });
            files.src.Form[util.format('%sType.php', fileName)] = render('src/Form/type.php', {
                schema: schema,
                schemas: schemas,
                name: name
            });
        });


        var relations = {};
        Object.keys(schemas).forEach(function (schemaName) {

                var schema = schemaParser.parse(schemas[schemaName]);

                Object.keys(schema.properties).forEach(function (name) {

                    var property = schema.properties[name];
                    if (property.type === 'array' && property.items) {

                        if (!Array.isArray(property.items)) {
                            property.items = [property.items];
                        }

                        property.items.forEach(function (item) {

                                var relSchema;
                                var relSchemaExist = true;
                                var relSchemaName;

                                if (item.ref && schemas.hasOwnProperty(item.ref)) {
                                    relSchema = schemas[item.ref];
                                    relSchemaName = item.ref;
                                    relSchemaExist = true;
                                } else if (schemas.hasOwnProperty(item.name)) {
                                    relSchemaName = item.name;
                                    relSchema = schemas[item.name];
                                    relSchemaExist = true;
                                } else {
                                    relSchemaName = item.name;
                                    relSchema = JSON.stringify(item);
                                    relSchemaExist = false;
                                }

                                var relSchemaDetailsName = util.format('%s_%s', schemaName, relSchemaName);

                                relations[relSchemaDetailsName] = {
                                    parent: {
                                        schema: schema,
                                        name: schemaName
                                    },
                                    child: {
                                        schema: relSchema ? schemaParser.parse(relSchema) : null,
                                        name: relSchemaName,
                                        exist: relSchemaExist
                                    },
                                    item: item
                                };


                            }
                        )
                        ;

                    }

                });

            }
        );


        var cleanPrimaryProperties = function (propertyOld, schemaNameOld) {

            var propertyRel = {};
            var property = Object.clone(propertyOld, true);
            var schemaName = Object.clone(schemaNameOld, true);

            if (property && typeof property === 'object') {

                Object.keys(property).forEach(function (propertyName) {
                    delete property[propertyName].primary;
                    delete property[propertyName].unique;
                    delete property[propertyName].uniqueItems;
                    delete property[propertyName].autoIncrement;

                    property[propertyName].name = schemaName;
                    property[propertyName].ref = schemaName;
                    property[propertyName].type = 'object';
                    propertyRel[schemaName] = property[propertyName];
                });
            }


            return propertyRel;
        };


        Object.keys(relations).forEach(function (relationName) {

            var relation = relations[relationName];
            if (!schemas[relation.child.name]) {
                schemas[relation.child.name] = relation.child.schema;
            }

        });


        Object.keys(relations).forEach(function (relationName) {

            var relation = relations[relationName];

            if (!relation || !relation.child || !relation.child.schema || !relation.child.schema.properties) {
                return false;
            }

            var schema = relation.parent.schema;
            var schemaChild = relation.child.schema;


            var propertySchemaOld = keysParser.firstPrimaryKey(schema);
            var propertyRelSchemaOld = keysParser.firstPrimaryKey(schemaChild);

            var propertySchema = cleanPrimaryProperties(propertySchemaOld, relation.parent.name);
            var propertyRelSchema = cleanPrimaryProperties(propertyRelSchemaOld, relation.child.name);


            var requiredFields = Object.keys(propertySchema).union(Object.keys(propertyRelSchema));

            var properties = Object.merge(propertySchema, propertyRelSchema);
            var newSchema = {
                properties: properties,
                required: requiredFields
            };


            if (!relation.child.exist && Object.keys(relation.child.schema.properties).length) {

                var fileName = string('_'+relation.child.name).camelize().s;

                files.src.Entity[util.format('%s.php', fileName)] = render('src/Entity/entity.php', {
                    schema: relation.child.schema,
                    schemas: schemas,
                    name: relation.child.name
                });
                files.src.Form[util.format('%sType.php', fileName)] = render('src/Form/type.php', {
                    schema: relation.child.schema,
                    schemas: schemas,
                    name: relation.child.name
                });
            }

            //if (Object.keys(newSchema.properties).length) {
            //    outputScript += "\n";
            //    outputScript += template.render('table.sql', {name: relationName, schema: newSchema, schemas: schemas});
            //    outputScript += template.render('constraints.sql', {
            //        name: relationName,
            //        schema: newSchema,
            //        schemas: schemas
            //    });
            //    outputScript += "\n";
            //}

        });

        return {
            files: files
        };
    }

};