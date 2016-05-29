function AbstractService(type) {
    this._Promise = require('Promise');
    this.type = type;
}

/**
 *
 * @returns {Promise}
 */
AbstractService.prototype.getAll = function() {
    var _this = this;

    return new this._Promise(function(resolve, reject) {
        _this.type.find({}, function(err, objs) {
            err ? reject(err) : resolve(objs ? objs : []);
        });
    });
};

/**
 *
 * @param id
 * @returns {Promise}
 */
AbstractService.prototype.get = function(id) {
    var _this = this;

    return new this._Promise(function(resolve, reject) {
        _this.type.findById(id, function(err, obj) {
            err ? reject(err) : resolve(obj);
        });


    });
};

/**
 *
 * @param entity
 * @returns {Promise}
 */
AbstractService.prototype.save = function(entity) {
    return new this._Promise(function(resolve, reject) {
        entity.save(function(err, obj) {
            err ? reject(err) : resolve(obj);
        });
    });
};

module.exports = AbstractService;