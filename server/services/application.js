var Application = require('models/application'),
    Promise = require('Promise'),
    manager = require('services/manager');

module.exports = {

    /**
     * Validate and create new instance by properties.
     *
     * @param properties {Object}
     * @param properties.name {String}
     * @param properties.enabled {Boolean}
     * @param properties.native {Boolean}
     * @returns {Application}
     */
    validateAndCreate: function(properties) {
        return manager.validateAndCreate(Application, properties, function(entity, properties) {
            entity.fill()
            entity.name = properties.name;
            entity.enabled = properties.enabled;
            entity.native = properties.native;
            return entity;
        });
    },

    /**
     * Get by id
     *
     * @param id
     * @returns {Promise}
     */
    get: function(id){
        return manager.get(Application, id);
    },

    /**
     * Get all
     *
     * @returns {Promise}
     */
    getAll: function(){
        return manager.getAll(Application);
    },

    /**
     * Get application by client id and client secret.
     *
     * @param clientId {String}
     * @param clientSecret {String}
     * @returns {Promise}
     */
    getByClientIdAndSecret: function(clientId, clientSecret){
        return new Promise(function(resolve, reject) {
            Application.findOne({clientId: clientId, clientSecret: clientSecret}, function(err, app) {
                err ? reject(err) : resolve(app);
            });
        });
    },

    /**
     * Save application.
     *
     * @param user {Application}
     * @returns {Application}
     */
    save: function(application) {
        return manager.save(application);
    }

};