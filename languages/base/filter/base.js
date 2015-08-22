/**
 * Loads utility filters to swig
 */

var swig = require('swig'),
    string = require('string');

swig.setFilter('capitalize', function (input) {
    return string(input).capitalize().s;
});

swig.setFilter('dasherize', function (input) {
    return string(input).dasherize().s;
});

swig.setFilter('latinise', function (input) {
    return string(input).latinise().s;
});

swig.setFilter('slugify', function (input) {
    return string(input).slugify().s;
});

swig.setFilter('camelize', function (input) {
    return string(input).camelize().s;
});