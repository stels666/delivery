var Http400Error = require('errors/Http400Error'),
    Http403Error = require('errors/Http403Error'),
    Http500Error = require('errors/Http500Error'),
    util = require('lib/util'),
    config = require('config'),
    tokenService = require('services/token'),
    applicationService = require('services/application'),
    userService = require('services/user'),
    manager = require('controllers/manager'),
    Permission = require('models/permission');


module.exports = function(app) {
    app.get('/auth', _processAuth);
    app.get('/auth/:id', _processGetToken);
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
function _processAuth(req, res, next) {
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
 * Process get auth tokens request, 2 cases:
 *  1. Get single token by id or accessToken;
 *  2. Get all tokens.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetToken(req, res, next) {
    if(req.params.id === 'all') {
        return _processGetAllTokens(req, res, next);
    } else if(req.params.id != null && req.params.id.trim().length > 0) {
        return _processGetSingleToken(req, res, next);
    } else {
        throw new Http400Error(config.get('errors:missingParameters'), 'Route parameter "id" is incorrect, available values: all or id of token.');
    }
}


/**
 * Generate access token service.
 *
 * Request query (/auth?type=access_token&client_id=EXAMPLE&client_secret=EXAMPLE&username=EXAMPLE&password=EXAMPLE):
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
 *      Token
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
 * Request query (/auth?type=refresh_token&client_id=EXAMPLE&client_secret=EXAMPLE&refresh_token=EXAMPLE):
 * <pre>
 *  client_id - required;
 *  client_secret - required;
 *  refresh_token - required.
 * </pre>
 *
 * Response:
 * <pre><code>
 * {
 *      Token
 *  }
 * </code></pre>
 * @param req
 * @param res
 * @private
 */
function _processGetAuthRefreshToken(req, res, next) {

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
                throw new Http403Error(config.get('errors:tokenNotFound'), 'Token not found.');
            }

            if(_token.isExpired()) {
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
 * Request query (/auth?type=validate_token&access_token=EXAMPLE):
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
function _processGetAuthValidateToken(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token}
    ]), token;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    tokenService.getTokenByAccessToken(req.query.access_token)

        .then(function(_token) {
            if(!_token) {
                throw new Http403Error(config.get('errors:tokenNotFound'), 'Token not found.');
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

            return userService.get(token.userId);
        })

        .then(function(_user) {
            if(!_user) {
                throw new Http403Error(config.get('errors:userNotFound'), 'User not found.');
            }

            if(!_user.enabled) {
                throw new Http403Error(config.get('errors:userDisabled'), 'User disabled.');
            }

            res.json({
                valid: !token.isExpired()
            });
        })

        .catch(function(error) {
            next(error);
        });
}


/**
 * Get all access token service.
 *
 * Request query (auth/all?access_token=EXAMPLE>):
 * <pre>
 *  access_token - required, current access token to validate.
 * </pre>
 *
 * Response:
 * <pre><code>
 * [
 *      ...
 *      Token,
 *      ...
 *  ]
 * </code></pre>
 * @param req
 * @param res
 * @private
 */
function _processGetAllTokens(req, res, next) {
    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, Permission.SUPER)

        .then(function(_result) {
            application = _result.application;
            return tokenService.getAll();
        })

        .then(function(_tokens){
            res.json(util.listToResponse(_tokens, application.native));
        })

        .catch(function(error) {
            next(error);
        });
}


/**
 * Get all access token service.
 *
 * Request query (auth/EXAMPLE?access_token=EXAMPLE):
 * <pre>
 *  id - required, internal id
 *  access_token - required, current access token to validate.
 * </pre>
 *
 * Response:
 * <pre><code>
 * {
 *      Token
 *  }
 * </code></pre>
 * @param req
 * @param res
 * @private
 */
function _processGetSingleToken(req, res, next) {
    var missing = util.requires([
        { name: 'id', value: req.params.id},
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, Permission.SUPER)

        .then(function(_result) {
            application = _result.application;
            return tokenService.get(req.params.id);
        })

        .then(function(_token){
            res.json(_token.toResponse(application.native));
        })

        .catch(function(error) {
            next(error);
        });
}