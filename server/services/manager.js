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
    },

    /**
     * Save object.
     *
     * @param entity
     * @returns {Promise}
     */
    save: function(entity) {
        return new Promise(function(resolve, reject) {
            entity.save(function(err, obj) {
                err ? reject(err) : resolve(obj);
            });
        });
    },

    /**
     * Validate properties and create object by type.
     * @param type
     * @param properties
     * @param fill {Function} return filled object.
     * @returns {Promise}
     */
    validateAndCreate: function(type, properties, fill) {
        return new Promise(function(resolve, reject) {
            var entity = new type();
            resolve(fill(entity, properties));
        });
    },

};