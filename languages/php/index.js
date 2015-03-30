var swig = require('swig'),
    util = require('util'),
    raml = require('../base/raml'),
    template = require('./render/template');


module.exports = function (ast, options) {


    var files = {
        app: {
            Http: {}
        }
    };

    //var RAMLObject = parse(ast);
    var RAMLObject = ast;
    var resources = raml.resources(RAMLObject);

    files.app.Http['routes.php'] = template.render('app/Http/routes.php', {resources: resources});

    return {
        files: files
    };
}
;