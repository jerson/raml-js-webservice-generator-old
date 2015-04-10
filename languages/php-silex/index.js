var swig = require('swig'),
    util = require('util'),
    raml = require('../base/raml'),
    template = require('./render/template');


module.exports = function (ast, options) {


    var files = {
        web: {},
        src: {
            Controllers:{},
            Models:{},
            Views:{}
        },
        raml:{}
    };


    //var RAMLObject = parse(ast);
    var RAMLObject = ast;
    var resources = raml.resources(RAMLObject);
    var resourceGroups = raml.resourceGroups(RAMLObject);

    files.raml['RAML.json'] = JSON.stringify(RAMLObject, null, 2);
    files.raml['RAML-resources.json'] = JSON.stringify(resources, null, 2);
    files.raml['RAML-resourceGroups.json'] = JSON.stringify(resourceGroups, null, 2);

    files.web['index.php'] = template.render('web/index.php', {resources: resources, resourceGroups: resourceGroups});

    resourceGroups.forEach(function(group){
        files.src.Controllers[util.format('%sController.php', group.name)] = template.render('src/Controllers/controller.php', {
            group: group
        });
    });

    return {
        files: files
    };
};