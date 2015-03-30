var swig = require('swig'),
    S = require('string');

swig.setFilter('capitalize', function (input) {
    return S(input).capitalize().s;
});

swig.setFilter('dasherize', function (input) {
    return S(input).dasherize().s;
});

swig.setFilter('latinise', function (input) {
    return S(input).latinise().s;
});

swig.setFilter('slugify', function (input) {
    return S(input).slugify().s;
});

swig.setFilter('camelize', function (input) {
    return S(input).camelize().s;
});