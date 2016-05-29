var Application = require('models/application'),
    AbstractService = require('services/abstract'),
    util = require('lib/util');

util.node.inherits(ApplicationService, AbstractService);

/**
 *
 * @constructor
 */
function ApplicationService() {
    AbstractService.call(this, Application);
}

/**
 * Validate and create new instance by properties.
 *
 * @param properties {Object}
 * @param properties.name {String}
 * @param properties.enabled {Boolean}
 * @param properties.native {Boolean}
 * @returns {Promise}
 */
ApplicationService.prototype.validateAndCreate = function(properties) {
   //TODO: validate
    return this.newPromise(function(resolve) {
        var entity = new Application().fill();

        entity.name = properties.name;
        entity.enabled = properties.enabled;
        entity.native = properties.native;

        resolve(entity);
    });
};

/**
 * Get application by client id and client secret.
 *
 * @param clientId {String}
 * @param clientSecret {String}
 * @returns {Promise}
 */

ApplicationService.prototype.getByClientIdAndSecret = function(clientId, clientSecret){
    return this.newPromise(function(resolve, reject) {
        Application.findOne({clientId: clientId, clientSecret: clientSecret}, function(err, app) {
            err ? reject(err) : resolve(app);
        });
    });
};


ApplicationService.newInstance = function() {
    return new ApplicationService();
};

module.exports = ApplicationService;