var Token = require('models/token'),
    Promise = require('Promise');

module.exports = {

    /**
     * Create new filled token.
     *
     * @param user {User}
     */
    createToken: function (user, application) {
        return new Promise(function(resolve, reject) {
            Token.newInstance(user, application).save(function(err, obj){
                console.log(arguments);
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