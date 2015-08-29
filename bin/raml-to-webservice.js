#!/usr/bin/env node

var assert = require('assert');
var Bluebird = require('bluebird');
var resolve = require('path').resolve;
var ramlParser = require('raml-parser');
var pkg = require('../package.json');
var languages = require('../src/languages');
var mkdirp = Bluebird.promisify(require('mkdirp'));
var writeFile = Bluebird.promisify(require('fs').writeFile);
var cwd = process.cwd();
var yargs = require('yargs');

/**
 * Resolve a path to current working directory.
 *
 * @param  {String} path
 * @return {String}
 */
var base = function (path) {
    return path ? resolve(cwd, path) : cwd;
};

/**
 * Parse the command line arguments.
 */
var argv = yargs.usage([
    'Generate Schema in any language.',
    '$0 api.raml --output script.sql --language phpSilex'
].join('\n\n'))
    .version(pkg.version, 'version')

    .alias('e', 'entry')
    .describe('e', 'Entry RAML file')

    .demand('o')
    .alias('o', 'output')
    .describe('o', 'Script output dir')

    .demand('l')
    .alias('l', 'language')
    .describe('l', 'Set the generated language')

    .argv;

/**
 * Pull out options into an object for passing into generator.
 *
 * @type {Object}
 */
var options = {
    entry: base(argv.entry || argv._[0]),
    output: base(argv.output),
    language: argv.language
};

/**
 * Generate the API client.
 */
Bluebird.resolve(options)
    .tap(function (options) {
        // Make sure the language exists
        assert(languages.hasOwnProperty(options.language), 'Unsupported language');
    })
    .then(function (options) {
        // Load the RAML file
        return ramlParser.loadFile(options.entry);
    })
    .then(function (ast) {
        // Process the RAML object using the selected language
        return languages[options.language](ast, options);
    })
    .then(function (output) {
        // Write the resulting output to the fs
        return objectToFs(options.output, output.files);
    })
    .then(function () {
        process.exit(0);
    })
    .catch(function (err) {
        // Log the error stacktrace
        console.error(err instanceof Error ? (err.stack || err.message) : err);

        return process.exit(1);
    });

/**
 * Save on object structure to the file system.
 *
 * @param  {String}  dir
 * @param  {Object}  objectToSave
 * @return {Promise}
 */
function objectToFs(dir, objectToSave) {
    var promise = mkdirp(dir);

    Object.keys(objectToSave).forEach(function (key) {
        var content = objectToSave[key];
        var filename = resolve(dir, key);

        promise = promise.then(function () {
            if (typeof content === 'object') {
                return objectToFs(filename, content);
            }

            return writeFile(filename, content);
        });
    });

    return promise.then(function () {
        return objectToSave;
    });
}
