/**
 * Generates source file from RAML
 */

var swig = require('swig'),
    util = require('util'),
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
        files.web['index.php'] = render('web/index.php', {resources: resources, resourceGroups: resourceGroups});

        // Render each *Controller.php file
        resourceGroups.forEach(function (group) {
            files.src.Controllers[util.format('%sController.php', group.name)] = render('src/Controllers/controller.php', {
                group: group
            });
        });

        return {
            files: files
        };
    }

};