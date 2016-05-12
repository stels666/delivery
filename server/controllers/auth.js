var Http400Error = require('errors/Http400Error'),
    Http403Error = require('errors/Http403Error'),
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
 *      access_token: string,
 *      expires_in: number,
 *      refresh_token: string
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
    ]),
        user,
        application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    applicationService.getByClientIdAndSecret(req.query.client_id, req.query.client_secret)
        .then(function(app){
            if(!app) {
                next(new Http403Error(config.get('errors:applicationNotFound'), 'Application not found.'));
            } else if(!app.enabled) {
                next(new Http403Error(config.get('errors:applicationDisabled'), 'Application disabled.'));
            }

            application = app;

            res.json(tokenService.createToken({_id: 2}, application));//TODO: remove hard code
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
 *      access_token: string,
 *      expires_in: number,
 *      refresh_token: string
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
    ]);

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    res.json({
        access_token: "1234567890tyfyqtd76qdfy",
        expires_in: 3600,
        refresh_token: "123456hvasvd56765asd7r"
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