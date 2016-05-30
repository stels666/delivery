var Tariff = require('models/tariff'),
    AbstractService = require('services/abstract'),
    util = require('lib/util'),
    logger = require('lib/logger')(module);

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


/**
 *
 * @param fromSettlement
 * @param toSettlement
 * @param cost {Number}
 * @param weight {Number}
 * @param length {Number}
 * @param width {Number}
 * @param height {Number}
 * @returns {Promise}
 */
TariffService.prototype.calculate = function(fromSettlement, toSettlement, cost, weight, length, width, height) {
    var _this = this;
    //TODO: validate
    return this.newPromise(function(resolve, reject){

        var coefficient = 0,
            flag = true;

        if(fromSettlement._id.equals(toSettlement._id)) {
            // The same

            if(fromSettlement.main == null) {
                // Main to the same main
                flag = false;
                coefficient = 1;
            }

            if(fromSettlement.main != null) {
                // Additional to the same additional
                flag = false;
                coefficient = fromSettlement.coefficient;
            }
        }


        if(!fromSettlement._id.equals(toSettlement._id)) {
            // Different

            if(fromSettlement.main != null && toSettlement.main != null) {
                // Additional to additional

                if(fromSettlement.main._id.equals(toSettlement.main._id) ) {
                    // Additional to additional through the same main
                    flag = false;
                    coefficient = 1 + fromSettlement.coefficient - fromSettlement.main.coefficient + toSettlement.coefficient - toSettlement.main.coefficient;
                }

                if(!fromSettlement.main._id.equals(toSettlement.main._id) ) {
                    // Additional to additional through different main
                    flag = false;
                    coefficient = 2 + fromSettlement.coefficient - fromSettlement.main.coefficient + toSettlement.coefficient - toSettlement.main.coefficient;
                }
            }

            if(fromSettlement.main == null && toSettlement.main != null) {
                // Main to additional

                if(fromSettlement._id.equals(toSettlement.main._id)) {
                    // Main to own additional
                    flag = false;
                    coefficient = toSettlement.coefficient;
                }

                if(!fromSettlement._id.equals(toSettlement.main._id)) {
                    // Main to different additional through main
                    flag = false;
                    coefficient = 1 + toSettlement.coefficient;
                }
            }

            if(fromSettlement.main != null && toSettlement.main == null) {
                // Additional to main

                if(fromSettlement.main._id.equals(toSettlement._id)) {
                    // Additional to own main
                    flag = false;
                    coefficient = fromSettlement.coefficient;
                }

                if(!fromSettlement.main._id.equals(toSettlement._id)) {
                    // Additional to different main through own main
                    flag = false;
                    coefficient = 1 + fromSettlement.coefficient;
                }
            }
        }

        if(flag) {
            logger.error(fromSettlement.toResponse());
            logger.error(toSettlement.toResponse());
        }

        _this.getByParameters(cost, weight, length, width, height)
            .then(function(tariff) {
                if(!tariff) {
                    throw new Error('Can not find tariff.');
                }
                resolve({
                    coefficient: coefficient,
                    cost: tariff.tariff * coefficient,
                    fromSettlement: fromSettlement.fullName(),
                    toSettlement: toSettlement.fullName()
                });
            })

            .catch(function(error) {
                reject(error);
            });
    });
};

/**
 *
 * @param cost {Number}
 * @param weight {Number} kg
 * @param length {Number} sm
 * @param width {Number} sm
 * @param height {Number} sm
 * @returns {Promise}
 */
TariffService.prototype.getByParameters = function(cost, weight, length, width, height) {

    var _this = this;
    //TODO: validate
    return this.newPromise(function(resolve, reject){
        var volume = length * width * height;

        Tariff.findOne({})
            //.where('weightMin').gt(weight)
            //.where('weightMax').lte(weight)
            //.where('volumeMin').gt(volume)
            //.where('volumeMin').lte(volume)
            //.where('costMin').gt(cost)
            //.where('costMax').lte(cost)
            //.where('lengthMax').lte(length)
            //.where('widthMax').lte(width)
            //.where('heightMax').lte(height)
            .exec( function(err, tariff) {

                err ? reject(err) : resolve(tariff);
            });
    });
};

TariffService.newInstance = function() {
    return new TariffService();
};

module.exports = TariffService;