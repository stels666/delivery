var Promise = require('Promise');

module.exports = {

    /**
     * Get object by type and id.
     * @param type
     * @param id
     * @returns {Promise}
     */
    get: function(type, id) {
        return new Promise(function(resolve, reject){
            type.findById(id, function(err, obj) {
                err ? reject(err) : resolve(obj);
            });
        });
    },

    /**
     * Get all objects by type.
     *
     * @returns {Promise}
     */
    getAll: function(type) {
        return new Promise(function(resolve, reject) {
            type.find({}, function(err, objs) {
                err ? reject(err) : resolve(objs ? objs : []);
            });
        });
    }

};