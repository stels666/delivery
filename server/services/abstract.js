var util = require('lib/util');

function AbstractService(type, populate) {
    this._Promise = require('Promise');
    this.type = type;

    if(populate != null && !util.node.isArray(populate)) {
        throw new Error('Populate must be array of strings or null');
    }
    this.populate = populate;
}

/**
 * Create populate string.
 * @returns {*}
 */
AbstractService.prototype.populateToString = function() {
    return this.populate ? this.populate.join(' ') : null;
};

/**
 *
 * @param fn
 * @returns {Promise}
 */
AbstractService.prototype.newPromise = function(fn) {
   return new this._Promise(fn);
};


/**
 *
 * @returns {Promise}
 */
AbstractService.prototype.getAll = function() {
    var _this = this;

    return new this._Promise(function(resolve, reject) {
        var query =_this.type.find({});

        if(_this.populate) {
            query = query.populate(_this.populateToString());
        }

        query.exec(function(err, objs) {
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
        var query = _this.type.findById(id);

        if(_this.populate) {
            query = query.populate(_this.populateToString());
        }

        query.exec(function(err, obj) {
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
    var _this = this;

    return new this._Promise(function(resolve, reject) {
        entity.save(function(err, obj) {
            if(err) {
                reject(err);
            } else if(_this.populate) {
                _this.type
                    .findById(obj._id)
                    .populate(_this.populateToString())
                    .exec(function(err, obj) {

                    err ? reject(err) : resolve(obj);
                });
            } else {
                resolve(obj);
            }
        });
    });
};

module.exports = AbstractService;