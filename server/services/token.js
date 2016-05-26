var Token = require('models/token'),
    Promise = require('Promise');

module.exports = {

    /**
     * Get tokens by id.
     *
     * @returns {Promise}
     */
    get: function(id) {
        return new Promise(function(resolve, reject) {
            Token.findById(id, function(err, obj) {
                err ? reject(err) : resolve(obj);
            });
        });
    },

    /**
     * Get all tokens.
     *
     * @returns {Promise}
     */
    getAll: function() {
        return new Promise(function(resolve, reject) {
            Token.find({}, function(err, objs) {
                err ? reject(err) : resolve(objs ? objs : []);
            });
        });
    },

    /**
     * Create new filled token.
     *
     * @param user {User}
     */
    createToken: function (user, application) {
        return new Promise(function(resolve, reject) {
            Token.newInstance(user, application).save(function(err, obj) {
                err ? reject(err) : resolve(obj);
            });
        });
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