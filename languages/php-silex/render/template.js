var swig = require('swig'),
    S = require('string'),
    util = require('util');

// Load the custom filters to swig
require('../filter/custom');

exports.render = function (file, params) {
    return swig.renderFile(util.format('%s/../template/%s.swig', __dirname, file), params);

    //FIXME the filename should be the same
    //var fileName = S(file).replace('.', ' ').camelize().s;
    //var template = swig.compile(folder[fileName], params);

    //return template(params);

};