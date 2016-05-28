var Promise = require('promise'),
    logger = require('lib/logger')(module),
    config = require('config');

/**
 *
 * @param models
 * @returns {User[]}
 * @private
 */
function _defaultUsers(models) {

    var admin = new models.User({ email: 'admin@admin.com', password: 'admin', firstName: 'admin', secondName: 'admin' });

    admin.addPermissions([models.Permission.SUPER]);

    return [admin];
}

/**
 *
 * @param models
 * @returns {Array}
 * @private
 */
function _defaultPermissions(models) {
    return models.Permission.all();
}

function _defaultApplications(models) {
    var nativeApp = models.Application.newInstance();

    nativeApp.native = true;
    nativeApp.clientId = 'admin';
    nativeApp.clientSecret = 'admin';

    return [nativeApp];
}

/**
 * Save all entities to db.
 *
 * @param entities {Array<Objects>} List of entities
 * @returns {Promise}
 * @private
 */
function _saveAll(entities) {
    
    var promises = [];

    entities.forEach(function(item) {
        promises.push(new Promise(function(resolve, reject){
            item.save(function(err, obj){
                err ? reject(err) : resolve(obj);
            });
        }));
    });

    return Promise.all(promises);
}


module.exports = {

    /**
     * Save to database default values.
     *
     * @param models
     * @returns {Promise}
     */
    defaultDBState: function(models) {
        if(!models) {
            logger.warn('Models is undefined.');
            return Promise.resolve();
        }

        logger.info('Try to save default entities to db.');

        return Promise.all([
            _saveAll(_defaultPermissions(models)),
            _saveAll(_defaultUsers(models)),
            _saveAll(_defaultApplications(models))
        ]);
    }
};