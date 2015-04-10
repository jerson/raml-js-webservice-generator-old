var swig = require('swig'),
    util = require('util'),
    raml = require('../base/raml'),
    template = require('./render/template');


module.exports = function (ast, options) {


    var files = {
        app: {
            Http: {
                Controllers: {}
            }
        }
    };

    //var RAMLObject = parse(ast);
    var RAMLObject = ast;
    var resources = raml.resources(RAMLObject);
    var resourceGroups = raml.resourceGroups(RAMLObject);

    files.app.Http['routes.php'] = template.render('app/Http/routes.php', {resources: resources});

    Object.keys(resourceGroups, function (groupName, groupResources) {

        var group = {
            resources: groupResources,
            name: groupName
        };

        files.app.Http.Controllers[util.format('%sController.php', groupName)] = template.render('app/Controllers/controller.php', {
            group: group
        });

    });

    return {
        files: files
    };
}
;