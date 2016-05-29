var Token = require('models/token'),
    Promise = require('Promise'),
    manager = require('services/manager');

module.exports = {

    /**
     * Get tokens by id.
     *
     * @returns {Promise}
     */
    get: function(id) {
        return manager.get(Token, id);
    },

    /**
     * Get all tokens.
     *
     * @returns {Promise}
     */
    getAll: function() {
        return manager.getAll(Token);
    },

    /**
     * Save new token.
     *
     * @param token
     * @returns {*}
     */
    save: function(token) {
        return manager.save(token);
    },

    /**
     * Validate access token.
     *
     * @param accessToken {String}
     * @returns {Promise}
     */
    validateAccessToken: function(accessToken) {
        return new Promise(function(resolve, reject) {
            Token.findOne({ accessToken: accessToken }, function(err, obj) {
                err ? reject(err) : resolve(obj && !obj.isExpired());
            });
        });
    },

    /**
     * Get token by refresh token.
     *
     * @param refreshToken {String}
     * @returns {Promise}
     */
    getTokenByRefreshToken: function(refreshToken) {
        return new Promise(function(resolve, reject) {
            Token.findOne({ refreshToken: refreshToken }, function(err, obj) {
                err ? reject(err) : resolve(obj);
            });
        });
    },

    /**
     * Get token by access token.
     *
     * @param refreshToken {String}
     * @returns {Promise}
     */
    getTokenByAccessToken: function(accessToken) {
        return new Promise(function(resolve, reject) {
            Token.findOne({ accessToken: accessToken }, function(err, obj) {
                err ? reject(err) : resolve(obj);
            });
        });
    }

}