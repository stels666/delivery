var Http400Error = require('errors/Http400Error'),
    util = require('lib/util'),
    config = require('config'),
    factory = require('services/factory'),
    manager = require('controllers/manager'),
    Permission = require('models/permission');


module.exports = function(app) {
    app.get('/private/settlement/get/:id', _processGetSettlement);
    app.post('/private/settlement/create', _processCreateSettlement);
};


/**
 * Process get settlement request, 2 cases:
 *  1. Get single settlement by id;
 *  2. Get all settlements.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function _processGetSettlement(req, res, next) {
    if(req.params.id === 'all') {
        return _processGetAllSettlements(req, res, next);
    } else if(req.params.id != null && req.params.id.trim().length > 0) {
        return _processGetSingleSettlement(req, res, next);
    } else {
        throw new Http400Error(config.get('errors:missingParameters'), 'Route parameter "id" is incorrect, available values: all or id of settlement.');
    }
}

function _processGetAllSettlements(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.SETTLEMENT_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getSettlementService().getAll();
        })

        .then(function(_settlement){
            res.json(_settlement ? util.listToResponse(_settlement, application.native) : []);
        })

        .catch(function(error) {
            next(error);
        });
}

function _processGetSingleSettlement(req, res, next) {

    var missing = util.requires([
        { name: 'id', value: req.params.id},
        { name: 'access_token', value: req.query.access_token}
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.SETTLEMENT_GET ])

        .then(function(_result) {
            application = _result.application;
            return factory.getSettlementService().get(req.params.id);
        })

        .then(function(_settlement){
            res.json(_settlement ? _settlement.toResponse(application.native) : null);
        })

        .catch(function(error) {
            next(error);
        });
}

function _processCreateSettlement(req, res, next) {

    var missing = util.requires([
        { name: 'access_token', value: req.query.access_token }
    ]), application;

    if(missing.length > 0) {
        throw new Http400Error(config.get('errors:missingParameters'), 'Missing parameters: ' + missing.join(', ') + '.');
    }

    manager.accessTokenPermissionChain(req.query.access_token, [ Permission.SUPER, Permission.SETTLEMENT_CREATE ])

        .then(function(_result) {
            application = _result.application;
            return factory.getSettlementService().validateAndCreate(req.body);
        })

        .then(function(_settlement){
            return factory.getSettlementService().save(_settlement);
        })

        .then(function(_settlement){
            res.json(_settlement ? _settlement.toResponse(application.native) : null);
        })

        .catch(function(error) {
            next(error);
        });
}