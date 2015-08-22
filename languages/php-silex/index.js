var generator = require('./generator');

module.exports = function (RAMLObject, options) {
    return generator.generate(RAMLObject, options);
};