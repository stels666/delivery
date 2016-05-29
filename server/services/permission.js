var Permission = require('models/permission'),
    AbstractService = require('services/abstract'),
    util = require('util');

util.inherits(PermissionService, AbstractService);

/**
 *
 * @constructor
 */
function PermissionService() {
    AbstractService.call(this, Permission);
}

/**
 * Get permissions by keys.
 *
 * @param keys {String[]}
 * @returns {Permission[]}
 */
PermissionService.prototype.getByKeys = function(keys) {
    return new this._Promise(function(resolve, reject) {
        if(keys == null || keys.length === 0) {
            resolve([]);
        }

        var query = [];

        for(var i = 0, max = keys.length; i < max; i += 1) {
            query.push({ key: keys[i] });
        }

        Permission.find({}).or(query).exec(function(err, objs){
            err ? reject(err) : resolve(objs);
        });
    });
};

PermissionService.newInstance = function() {
    return new PermissionService();
}

module.exports = PermissionService;