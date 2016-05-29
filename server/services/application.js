var Application = require('models/application'),
    Promise = require('Promise');

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
        return new Promise(function(resolve, reject) {
            var application = new Application().fill();

            application.name = properties.name;
            application.enabled = properties.enabled;
            application.native = properties.native;

            resolve(application);
        });
    },

    /**
     * Get by id
     *
     * @param id
     * @returns {Promise}
     */
    get: function(id){
        return new Promise(function(resolve, reject) {
            Application.findById(id, function(err, app) {
                err ? reject(err) : resolve(app);
            });
        });
    },

    /**
     * Get all
     *
     * @returns {Promise}
     */
    getAll: function(){
        return new Promise(function(resolve, reject) {
            Application.find({}, function(err, apps) {
                err ? reject(err) : resolve(apps);
            });
        });
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
        return new Promise(function(resolve, reject) {
            application.save(function(err, obj) {
                err ? reject(err) : resolve(obj);
            });
        });
    }

};