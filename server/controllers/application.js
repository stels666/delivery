var Http400Error = require('errors/Http400Error'),
    util = require('lib/util'),
    config = require('config'),
    factory = require('services/factory'),
    manager = require('controllers/manager'),
    Permission = require('models/permission');


module.exports = function(app) {
    app.get('/application/private/get/:id', _processGetApplication);
    app.post('/application/private/create', _processCreateApplication);
};

/**
 * Process get application request, 2 cases:
 *  1. Get single application by id;
 *  2. Get all applications.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetApplication(req, res, next) {
    if(req.params.id === 'all') {
        return _processGetAllApplications(req, res, next);
    } else if(req.params.id != null && req.params.id.trim().length > 0) {
        return _processGetSingleApplication(req, res, next);
    } else {
        throw new Http400Error(config.get('errors:missingParameters'), 'Route parameter "id" is incorrect, available values: all or id of application.');
    }
}

/**
 * Get all application.
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetAllApplications(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.APPLICATION_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getApplicationService().getAll();
        })

        .then(function(_applications){
            res.json(_applications ? util.listToResponse(_applications, application.native) : []);
        })

        .catch(function(error) {
            next(error);
        });
}

/**
 * Get application by id.
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetSingleApplication(req, res, next) {

    var missing = util.requires([
        { name: 'id', value: req.params.id},
        { name: 'access_token', value: req.query.access_token}
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.APPLICATION_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getApplicationService().get(req.params.id);
        })

        .then(function(_application){
            res.json(_application ? _application.toResponse(application.native) : null);
        })

        .catch(function(error) {
            next(error);
        });
}

/**
 * Create new application.
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processCreateApplication(req, res, next) {
    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.APPLICATION_CREATE ])

        .then(function(_result) {
            application = _result.application;
            return factory.getApplicationService().validateAndCreate(req.body);
        })

        .then(function(_application){
            return factory.getApplicationService().save(_application);
        })

        .then(function(_application){
            res.json(_application ? _application.toResponse(application.native) : null);
        })

        .catch(function(error) {
            next(error);
        });
}