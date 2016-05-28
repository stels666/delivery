var Http400Error = require('errors/Http400Error'),
    Http403Error = require('errors/Http403Error'),
    config = require('config'),
    util = require('lib/util'),
    logger = require('lib/logger')(module),
    userService = require('services/user'),
    tokenService = require('services/token'),
    manager = require('controllers/manager'),
    Permission = require('models/permission');

module.exports = function(app) {
    app.get('/user/:id', _processGetUser);
};

/**
 * Process get user request, 2 cases:
 *  1. Get single user by id;
 *  2. Get all users.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetUser(req, res, next) {
    if(req.params.id === 'all') {
        return _processGetAllUser(req, res, next);
    } else if(req.params.id != null && req.params.id.trim().length > 0) {
        return _processGetSingleUser(req, res, next);
    } else {
        throw new Http400Error(config.get('errors:missingParameters'), 'Route parameter "id" is incorrect, available values: all or id of user.');
    }
}

/**
 * Get all users.
 *
 * Response:
 * <pre><code>
 * {
 *      ...user fields...
 *  }
 * </code></pre>
 * or
 * <pre><code>null</code></pre>
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetSingleUser(req, res, next) {

    var missing = util.requires([
        { name: 'id', value: req.params.id},
        { name: 'access_token', value: req.query.access_token}
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.USER_GET ])

        .then(function(_result) {
            application = _result.application;
            return userService.get(req.params.id);
        })

        .then(function(_user){
            res.json(_user.toResponse(application.native));
        })

        .catch(function(error) {
            next(error);
        });
}

/**
 * Get user by id.
 *
 * Request query:
 * <pre>
 *  id - required.
 * </pre>
 *
 * Response:
 * <pre><code>
 * [
 *      {...user fields...},
 *      ...
 * ]
 * </code></pre>
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetAllUser(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.USER_GET ])

        .then(function(_result) {
            application = _result.application;
            return userService.getAll();
        })

        .then(function(_users){
            res.json(util.listToResponse(_users, application.native));
        })

        .catch(function(error) {
            next(error);
        });
}