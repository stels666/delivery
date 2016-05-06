var nconf = require('nconf'),
    path = require('path');

/*
 * Configure nconf
 */
nconf.argv()
    .env() // read from environment
    .file({ file: path.join(__dirname, 'config.json') }); // read from file

module.exports = nconf;