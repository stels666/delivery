var Application = require('models/application'),
    Promise = require('Promise');

module.exports = {

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
    }

};