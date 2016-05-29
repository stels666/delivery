var Http400Error = require('errors/Http400Error'),
    util = require('lib/util'),
    config = require('config'),
    factory = require('services/factory'),
    manager = require('controllers/manager'),
    Permission = require('models/permission');


module.exports = function(app) {
    app.get('/tariff/private/get/:id', _processGetTariff);
    app.post('/tariff/private/create', _processCreateTariff);
    app.post('/tariff/public/calculate', _processCalculateTariff);
};

/**
 * Process get tariff request, 2 cases:
 *  1. Get single tariff by id;
 *  2. Get all tariffs.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetTariff(req, res, next) {
    if(req.params.id === 'all') {
        return _processGetAllTariff(req, res, next);
    } else if(req.params.id != null && req.params.id.trim().length > 0) {
        return _processGetSingleTariff(req, res, next);
    } else {
        throw new Http400Error(config.get('errors:missingParameters'), 'Route parameter "id" is incorrect, available values: all or id of application.');
    }
}

/**
 * Get all tariffs.
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetAllTariff(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.TARIFF_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getTariffService().getAll();
        })

        .then(function(_tariffs){
            res.json(_tariffs ? util.listToResponse(_tariffs, application.native) : []);
        })

        .catch(function(error) {
            next(error);
        });
}

/**
 * Get tariff by id.
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetSingleTariff(req, res, next) {

    var missing = util.requires([
        { name: 'id', value: req.params.id},
        { name: 'access_token', value: req.query.access_token}
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.TARIFF_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getTariffService().get(req.params.id);
        })

        .then(function(_tariff){
            res.json(_tariff ? _tariff.toResponse(application.native) : null);
        })

        .catch(function(error) {
            next(error);
        });
}

function _processCreateTariff(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.TARIFF_CREATE ])

        .then(function(_result) {
            application = _result.application;
            return factory.getTariffService().validateAndCreate(req.body);
        })

        .then(function(_tariff){
            return factory.getTariffService().save(_tariff);
        })

        .then(function(_tariff){
            res.json(_tariff ? _tariff.toResponse(application.native) : null);
        })

        .catch(function(error) {
            next(error);
        });
}

function _processCalculateTariff(req, res, next) {
    res.json({ cost: 100 });
}