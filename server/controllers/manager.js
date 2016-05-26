var Http400Error = require('errors/Http400Error'),
    Http403Error = require('errors/Http403Error'),
    Http500Error = require('errors/Http500Error'),
    util = require('lib/util'),
    config = require('config'),
    tokenService = require('services/token'),
    applicationService = require('services/application'),
    userService = require('services/user'),
    Promise = require('Promise');

module.exports = {

    /**
     * Application -> User
     *
     * @param token {Token}
     * @returns {Promise}
     */
    tokenChain: function(token) {
        return new Promise(function(resolve, reject) {
            var application;

            Promise.resolve(token)

                .then(function(_token) {
                    if(!_token || _token.isExpired()) {
                        throw new Http403Error(config.get('errors:invalidAccessToken'), 'Invalid access token.');
                    }

                    token = _token;
                    return applicationService.get(_token.applicationId);
                })

                .then(function(_application){
                    if(!_application) {
                        throw new Http403Error(config.get('errors:applicationNotFound'), 'Application not found.');
                    }

                    if(!_application.enabled) {
                        throw new Http403Error(config.get('errors:applicationDisabled'), 'Application disabled.');
                    }

                    application = _application;
                    return userService.get(token.userId);
                })

                .then(function(_user) {
                    if(!_user) {
                        throw new Http403Error(config.get('errors:userNotFound'), 'User not found.');
                    }

                    if(!_user.enabled) {
                        throw new Http403Error(config.get('errors:userDisabled'), 'User disabled.');
                    }

                    resolve({token: token, application: application, user: _user});
                })

                .catch(function(error) {
                    reject(error);
                })
        });
    },

    /**
     * Token -> Application -> User
     *
     * @param accessToken
     */
    accessTokenChain: function(accessToken) {
        var _this = this;

        return new Promise(function(resolve, reject) {
            Promise.resolve(accessToken)

                .then(function(_accessToken) {
                    if(!_accessToken) {
                        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: accessToken.');
                    }

                    return tokenService.getTokenByAccessToken(_accessToken);
                })

                .then(function(_token) {
                    return _this.tokenChain(_token);
                })

                .then(function(result) {
                    resolve(result);
                })

                .catch(function(error) {
                    reject(error);
                })
        });
    }

};