var Http400Error = require('errors/Http400Error'),
    util = require('lib/util'),
    config = require('config'),
    factory = require('services/factory'),
    manager = require('controllers/manager'),
    Permission = require('models/permission');


module.exports = function(app) {
    app.get('/permission/:id', _processGetPermission);
};

/**
 * Process get permission request, 2 cases:
 *  1. Get single permission by id;
 *  2. Get all permissions.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetPermission(req, res, next) {
    if(req.params.id === 'all') {
        return _processGetAllPermissions(req, res, next);
    } else if(req.params.id != null && req.params.id.trim().length > 0) {
        return _processGetSinglePermission(req, res, next);
    } else {
        throw new Http400Error(config.get('errors:missingParameters'), 'Route parameter "id" is incorrect, available values: all or id of permission.');
    }
}

function _processGetAllPermissions(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.PERMISSION_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getPermissionService().getAll();
        })

        .then(function(_permission){
            res.json(_permission ? util.listToResponse(_permission, application.native) : []);
        })

        .catch(function(error) {
            next(error);
        });
}

function _processGetSinglePermission(req, res, next) {

    var missing = util.requires([
        { name: 'id', value: req.params.id},
        { name: 'access_token', value: req.query.access_token}
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.PERMISSION_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getPermissionService().get(req.params.id);
        })

        .then(function(_permission){
            res.json(_permission ? _permission.toResponse(application.native) : null);
        })

        .catch(function(error) {
            next(error);
        });
}