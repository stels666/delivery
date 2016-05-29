var Permission = require('models/permission'),
    AbstractService = require('services/abstract'),
    util = require('lib/util');

util.node.inherits(PermissionService, AbstractService);

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
 * @returns {Promise}
 */
PermissionService.prototype.getByKeys = function(keys) {
    return this.newPromise(function(resolve, reject) {
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
};

module.exports = PermissionService;