var swig = require('swig');
require('sugar');
require('./base/filter/base');

// List of all the languages available to the generator
exports.phpSilex = require('./php-silex/generator').generate;