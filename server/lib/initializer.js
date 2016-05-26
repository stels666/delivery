var Promise = require('promise'),
    logger = require('lib/logger')(module),
    config = require('config');

/**
 *
 * @param models
 * @param permissions
 * @returns {User[]}
 * @private
 */
function _defaultUsers(models, permissions) {

    var admin = new models.User({ email: 'admin@admin.com', password: 'admin', firstName: 'admin', secondName: 'admin' });

    admin.addPermissions(permissions);

    return [admin];
}

/**
 *
 * @param models
 * @returns {Array}
 * @private
 */
function _defaultPermissions(models) {

    var permissions = [],
        raw = config.get('permissions');

    for(var i = 0, max = raw.length; i < max; i += 1) {
        permissions.push(new models.Permission({ key: raw[i].key, description: raw[i].description }));
    };

    return permissions;
}

function _defaultApplications(models) {
    var nativeApp = models.Application.newInstance();

    nativeApp.native = true;

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

        var permissions = _defaultPermissions(models);

        return Promise.all([
            _saveAll(permissions),
            _saveAll(_defaultUsers(models, permissions)),
            _saveAll(_defaultApplications(models))
        ]);
    }
};