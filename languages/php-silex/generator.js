/**
 * Generates source file from RAML
 */

var swig = require('swig'),
    util = require('util'),
    string = require('string'),
    raml = require('../base/raml');

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
                Form: {},
                views: {}
            },
            var: {
                cache:{},
                logs:{}
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

        files.bin['console'] = render('bin/console');

        files.config['dev.php'] = render('config/dev.php');
        files.config['prod.php'] = render('config/prod.php');

        files.var.cache['.gitignore'] = render('var/cache/.gitignore');
        files.var.logs['.gitignore'] = render('var/logs/.gitignore');

        files.web['index.php'] = render('web/index.php', {resources: resources, resourceGroups: resourceGroups});
        files.web['index_dev.php'] = render('web/index_dev.php', {resources: resources, resourceGroups: resourceGroups});
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
            var fileName = string(name).capitalize().s;
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

        return {
            files: files
        };
    }

};