var Permission = require('models/permission'),
    Promise = require('Promise'),
    manager = require('services/manager');

module.exports = {

    /**
     * Get permission by id.
     *
     * @returns {Promise}
     */
    get: function(id) {
        return manager.get(Permission, id);
    },

    /**
     * Get all permissions.
     *
     * @returns {Promise}
     */
    getAll: function() {
        return manager.getAll(Permission);
    },

    /**
     * Get permissions by keys.
     *
     * @param keys {String[]}
     * @returns {Permission[]}
     */
    getByKeys: function(keys) {
        return new Promise(function(resolve, reject) {
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
    }

};