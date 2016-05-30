var Settlement = require('models/settlement'),
    AbstractService = require('services/abstract'),
    util = require('lib/util');

util.node.inherits(SettlementService, AbstractService);

/**
 *
 * @constructor
 */
function SettlementService() {
    AbstractService.call(this, Settlement, [ 'main' ]);
}

/**
 *
 * @param properties
 * @returns {Promise}
 */
SettlementService.prototype.validateAndCreate = function(properties) {
    //TODO: validate
    return this.newPromise(function(resolve) {
        var entity = new Settlement();

        entity.countryCode = properties.countryCode;
        entity.country = properties.country;
        entity.areaType = properties.areaType;
        entity.areaTypeShort = properties.areaTypeShort;
        entity.area = properties.area;
        entity.district = properties.district;
        entity.districtType = properties.districtType;
        entity.districtTypeShort = properties.districtTypeShort;
        entity.settlementType = properties.settlementType;
        entity.settlementTypeShort = properties.settlementTypeShort;
        entity.name = properties.name;
        entity.postcode = properties.postcode;
        entity.latitude = properties.latitude;
        entity.longitude = properties.longitude;
        entity.main = properties.main;
        entity.coefficient = properties.coefficient;

        resolve(entity);
    });
};

SettlementService.newInstance = function() {
    return new SettlementService();
};

module.exports = SettlementService;