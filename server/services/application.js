var Application = require('models/application'),
    Promise = require('Promise');

module.exports = {

    /**
     * Get application by client id and client secret.
     *
     * @param clientId {String}
     * @param clientSecret {String}
     * @returns {Promise}
     */
    getByClientIdAndSecret: function(clientId, clientSecret){
        return new Promise(function(resolve, reject) {
            Application.find({clientId: clientId, clientSecret: clientSecret}, function(err, app) {
                err ? reject(err) : resolve(err);
            });
        });
    }

};