var randtoken = require('rand-token'),
    config = require('config'),
    format = require('string-format'),
    Promise = require('promise'),
    bcrypt = require('bcrypt'),
    DeliveryError = require('errors/Http500Error');

module.exports = {

    /**
     * Validate parameters, check if parameter is null.
     *
     * @param parameters
     * @returns {Array}
     */
    requires: function(parameters){
        var names = [];

        for(var i = 0, max = parameters.length; i < max; i += 1) {
            if(parameters[i].value == null) {
                names.push(parameters[i].name);
            }
        }

        return names;
    },


    /**
     *  Generate specific key by code type.
     *
     * @param type {number} Key type (0 - access token, 1 - refresh token, 2 - client id, 3 - client secret)
     * @returns {String} generated key
     */
    generateKey: function(type) {
        var key =  randtoken.generate(config.get('keys:tokenLength'));

        switch (type) {
            case 0:
                return format(config.get('keys:accessTokenMask'), key);
            case 1:
                return format(config.get('keys:refreshTokenMask'), key);
            case 2:
                return format(config.get('keys:clientIdMask'), key);
            case 3:
                return format(config.get('keys:clientSecretMask'), key);
            default:
                throw new DeliveryError('Invalid arguments', config.get('errors:invalidArguments'), 'Unknown type ' + type);
        };
    },


    /**
     * Generate random salt.
     *
     * @returns {Promise}
     */
    generateSalt: function() {
        return new Promise(function(resolve, reject) {
            bcrypt.genSalt(config.get('keys:saltWorkFactor'), function(err, salt) {
                err ? reject(err) : resolve(salt);
            });
        });
    },


    /**
     * Generate hash by string and salt
     *
     * @param str {String} String to encrypt
     * @param salt {String}
     * @returns {Promise}
     */
    generateHash: function(str, salt) {
        return new Promise(function(resolve, reject) {
            bcrypt.hash(str, salt, function(err, hash) {
                err ? reject(err) : resolve(hash);
            });
        });
    },


    /**
     * Compare original and hashed string.
     *
     * @param original {String} Original string to compare.
     * @param hashed {String} Hashed string to compare.
     * @returns {Promise}
     */
    compareHashed: function(original, hashed) {
        return new Promise(function(resolve, reject) {
            bcrypt.compare(original, hashed, function(err, isMatch) {
                err ? reject(err) : resolve(isMatch);
            });
        });
    }
}