var Promise = require('promise'),
    logger = require('lib/logger')(module);


function _defaultUsers(models) {
     return [
         new models.User({ email: 'admin@admin.com', password: 'admin', firstName: 'admin', secondName: 'admin' }),
         new models.User({ email: 'user@user.com', password: 'user', firstName: 'user', secondName: 'user' })
     ];
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
            _saveAll(_defaultUsers(models))
        ]);
    }
};