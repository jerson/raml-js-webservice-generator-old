/**
 * Created by jahd on 22/08/15.
 */

var swig = require('swig'),
    util = require('util'),
    raml = require('../base/raml'),
    template = require('./render/template');

module.exports = {
    /**
     * Generate the files to output by inserting the RAML data in the templates
     * @param RAMLObject
     * @param options
     * @returns {{files: {web: {}, src: {Controllers: {}, Models: {}, Views: {}}, raml: {}}}}
     */
    generate: function (RAMLObject, options) {

        var files = {
            web: {},
            src: {
                Controllers: {},
                Models: {},
                Views: {}
            },
            raml: {}
        };

        var resources = raml.resources(RAMLObject);
        var resourceGroups = raml.resourceGroupsFromResources(resources);

        // Dumps the variables to raml/
        files.raml['RAML.json'] = JSON.stringify(RAMLObject, null, 2);
        files.raml['RAML-resources.json'] = JSON.stringify(resources, null, 2);
        files.raml['RAML-resourceGroups.json'] = JSON.stringify(resourceGroups, null, 2);

        // Render the index.php file
        files.web['index.php'] = template.render('web/index.php', {resources: resources, resourceGroups: resourceGroups});

        // Render each *Controller.php file
        resourceGroups.forEach(function (group) {
            files.src.Controllers[util.format('%sController.php', group.name)] = template.render('src/Controllers/controller.php', {
                group: group
            });
        });

        return {
            files: files
        };
    }
};


