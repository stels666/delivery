var Http400Error = require('errors/Http400Error'),
    Http403Error = require('errors/Http403Error'),
    Http500Error = require('errors/Http500Error'),
    util = require('lib/util'),
    config = require('config'),
    tokenService = require('services/token'),
    applicationService = require('services/application'),
    userService = require('services/user');


module.exports = function(app) {
    app.get('/auth', _processGetAuth);
};


/**
 * Process auth request, there are 3 cases:
 *
 *  1. Generate access token;
 *  2. Refresh access token;
 *  3. Validate access token.
 *
 * Otherwise throw Http400Error.
 *
 * @param req
 * @param res
 * @private
 */
function _processGetAuth(req, res, next) {
    switch(req.query.type) {
        case 'access_token':
            return _processGetAuthAccessToken(req, res, next);
        case 'refresh_token':
            return _processGetAuthRefreshToken(req, res, next);
        case 'validate_token':
            return _processGetAuthValidateToken(req, res, next);
        default:
            throw new Http400Error(config.get('errors:missingParameters'), 'Parameter "type" is incorrect, available values: access_token, refresh_token, validate_token.');
    }
}

/**
 * Generate access token service.
 *
 * Request query:
 * <pre>
 *  client_id - required;
 *  client_secret - required;
 *  username - required;
 *  password - required.
 * </pre>
 *
 * Response:
 * <pre><code>
 * {
 *      accessToken: string,
 *      expiresIn: number,
 *      refreshToken: string
 *  }
 * </code></pre>
 * @param req
 * @param res
 * @private
 */
function _processGetAuthAccessToken(req, res, next) {

    var missing = util.requires([
        { name: 'client_id', value: req.query.client_id},
        { name: 'client_secret', value: req.query.client_secret},
        { name: 'username', value: req.query.username},
        { name: 'password', value: req.query.password}
    ]), application, user;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    applicationService.getByClientIdAndSecret(req.query.client_id, req.query.client_secret)
        .then(function(_application){

            if(!_application) {
                throw new Http403Error(config.get('errors:applicationNotFound'), 'Application not found.');
            }

            if(!_application.enabled) {
                throw new Http403Error(config.get('errors:applicationDisabled'), 'Application disabled.');
            }

            application = _application;
            return userService.getByEmail(req.query.username);
        })

        .then(function(_user) {
            if(!_user) {
                throw new Http403Error(config.get('errors:userNotFound'), 'User not found.');
            }

            if(!_user.enabled) {
                throw new Http403Error(config.get('errors:userDisabled'), 'User disabled.');
            }

            user = _user;
            return user.comparePasswords(req.query.password);
        })

        .then(function(match) {
            if(!match) {
                throw new Http403Error(config.get('errors:incorrectUserPassword'), 'Incorrect user password.');
            }

            return tokenService.createToken(user, application);
        })

        .then(function(token) {
            if(!token) {
                throw new Http500Error(config.get('errors:canNotCreateToken'), 'Can not create token.');
            }

            res.json(token.toResponse(application.native));
        })

        .catch(function(err) {
            next(err);
        });
}

/**
 * Refresh access token service.
 *
 * Request query:
 * <pre>
 *  client_id - required;
 *  client_secret - required;
 *  refresh_token - required.
 * </pre>
 *
 * Response:
 * <pre><code>
 * {
 *      accessToken: string,
 *      expiresIn: number,
 *      refreshToken: string
 *  }
 * </code></pre>
 * @param req
 * @param res
 * @private
 */
function _processGetAuthRefreshToken(req, res) {

    var missing = util.requires([
        { name: 'client_id', value: req.query.client_id},
        { name: 'client_secret', value: req.query.client_secret},
        { name: 'refresh_token', value: req.query.refresh_token}
    ]), oldToken, application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    tokenService.getTokenByRefreshToken(req.query.refresh_token)
        .then(function(_token) {
            if(!_token) {
                throw new Http403Error(config.get('errors:invalidAccessToken'), 'Invalid access token.');
            }

            oldToken = _token;
            return applicationService.getByClientIdAndSecret(req.query.client_id, req.query.client_secret);
        })

        .then(function(_application){

            if(!_application) {
                throw new Http403Error(config.get('errors:applicationNotFound'), 'Application not found.');
            }

            if(!_application.enabled) {
                throw new Http403Error(config.get('errors:applicationDisabled'), 'Application disabled.');
            }

            application = _application;
            return userService.get(oldToken.userId);
        })

        .then(function(_user) {
            if(!_user) {
                throw new Http403Error(config.get('errors:userNotFound'), 'User not found.');
            }

            if(!_user.enabled) {
                throw new Http403Error(config.get('errors:userDisabled'), 'User disabled.');
            }

            return tokenService.createToken(_user, application);
        })

        .then(function(_token) {
            if(!_token) {
                throw new Http500Error(config.get('errors:canNotCreateToken'), 'Can not create token.');
            }

            res.json(_token.toResponse(application.native));
        })

        .catch(function(err) {
            next(err);
        });
}

/**
 * Validate access token service.
 *
 * Request query:
 * <pre>
 *  access_token - required, current access token to validate.
 * </pre>
 *
 * Response:
 * <pre><code>
 * {
 *      valid: boolean
 *  }
 * </code></pre>
 * @param req
 * @param res
 * @private
 */
function _processGetAuthValidateToken(req, res) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token}
    ]);

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    res.json({
        valid: true
    });
}