var swig = require('swig'),
    S = require('string'),
    util = require('util');

require('../filter/custom');

//var includeFolder = require('include-folder'),
//    folder = includeFolder(__dirname + '/../template');


exports.render = function (file, params) {
    return swig.renderFile(util.format('%s/../template/%s.swig', __dirname, file), params);

    //FIXME el nombre del archivo debería ser el mismo
    //var fileName = S(file).replace('.', ' ').camelize().s;
    //var template = swig.compile(folder[fileName], params);

    //return template(params);

};