var Tariff = require('models/tariff'),
    AbstractService = require('services/abstract'),
    util = require('lib/util');

util.node.inherits(TariffService, AbstractService);

/**
 *
 * @constructor
 */
function TariffService() {
    AbstractService.call(this, Tariff);
}

/**
 * Validate and create new instance by properties.
 *
 * @param properties {Object}
 * @param properties.weightMin {Number}
 * @param properties.weightMax {Number}
 * @param properties.volumeMin {Number}
 * @param properties.volumeMax {Number}
 * @param properties.costMin {Number}
 * @param properties.costMax {Number}
 * @param properties.lengthMax {Number}
 * @param properties.widthMax {Number}
 * @param properties.heightMax {Number}
 * @param properties.tariff {Number}
 * @returns {Promise}
 */
TariffService.prototype.validateAndCreate = function(properties) {
    //TODO: validate
    return this.newPromise(function(resolve, reject){
        var tariff = new Tariff();

        tariff.weightMin = properties.weightMin;
        tariff.weightMax = properties.weightMax;
        tariff.volumeMin = properties.volumeMin;
        tariff.volumeMax = properties.volumeMax;
        tariff.costMin = properties.costMin;
        tariff.costMax = properties.costMax;
        tariff.lengthMax = properties.lengthMax;
        tariff.widthMax = properties.widthMax;
        tariff.heightMax = properties.heightMax;
        tariff.tariff = properties.tariff;

        resolve(tariff);
    });
};

TariffService.newInstance = function() {
    return new TariffService();
};

module.exports = TariffService;