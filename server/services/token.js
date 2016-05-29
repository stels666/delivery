var Token = require('models/token'),
    AbstractService = require('services/abstract'),
    util = require('lib/util');

util.node.inherits(TokenService, AbstractService);

/**
 *
 * @constructor
 */
function TokenService() {
    AbstractService.call(this, Token);
}


/**
 * Validate access token.
 *
 * @param accessToken {String}
 * @returns {Promise}
 */
TokenService.prototype.validateAccessToken = function(accessToken) {
    return this.newPromise(function(resolve, reject) {
        Token.findOne({ accessToken: accessToken }, function(err, obj) {
            err ? reject(err) : resolve(obj && !obj.isExpired());
        });
    });
};


/**
 * Get token by refresh token.
 *
 * @param refreshToken {String}
 * @returns {Promise}
 */
TokenService.prototype.getTokenByRefreshToken = function(refreshToken) {
    return this.newPromise(function(resolve, reject) {
        Token.findOne({ refreshToken: refreshToken }, function(err, obj) {
            err ? reject(err) : resolve(obj);
        });
    });
};


/**
 * Get token by access token.
 *
 * @param refreshToken {String}
 * @returns {Promise}
 */
TokenService.prototype.getTokenByAccessToken = function(accessToken) {
    return this.newPromise(function(resolve, reject) {
        Token.findOne({ accessToken: accessToken }, function(err, obj) {
            err ? reject(err) : resolve(obj);
        });
    });
};


TokenService.newInstance = function() {
    return new TokenService();
};

module.exports = TokenService;