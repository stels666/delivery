var mongoose = require('mongoose'),
    config = require('config'),
    Promise = require('promise'),
    logger = require('lib/logger')(module);

/**
 * Define models to initialize.
 *
 * @private
 */
function _define(){
    require('models/user');
    require('models/token');
}

module.exports = {

    /**
     * Connect to database,
     * return native mongo db if success,
     * return error if fail.
     *
     * @returns {Promise}
     */
    connect: function() {

        return new Promise(function(resolve, reject) {

            mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

            /*
             * Listen to connection error
             */
            mongoose.connection.on('error', function(err) {
                reject(err);
            });

            /*
             * Listen to connection success
             */
            mongoose.connection.once('open', function() {
                resolve(mongoose.connection.db);
            });

            /*
             * Listen to connection closing
             */
            mongoose.connection.on('close', function() {
                logger.info('Connection to database is closed.');
            });
        });
    },


    /**
     * Drop database,
     * return nothing if success,
     * return error if fail.
     *
     * @param db {Object} The mongodb.Db instance, set when the connection is opened.
     * @returns {Promise}
     */
    drop: function(db) {
        return new Promise(function(resolve, reject) {
            db.dropDatabase(function(err) {
                err ? reject(err) : resolve();
            })
        });
    },


    /**
     * Init models,
     * return list of models name if success,
     * return error if fail.
     *
     * @returns {Array<Promise>}
     */
    requireModels: function() {
        var promises = [],
            names = [],
            i = 0;

        _define();

        for(model in mongoose.models) {

            promises.push(new Promise(function(resolve, reject) {
                names.push(model);
                mongoose.models[model].ensureIndexes(function(err) {
                    err ? reject(err) : resolve(names[i++]);
                });
            }));
        }

        return Promise.all(promises);
    },


    /**
     * Init database (open, init models),
     * return list of models if resolve,
     * return error if fail.
     *
     * @returns {Promise}
     */
    init: function() {

        var _this = this;

        return new Promise(function(resolve, reject) {
            _this.connect()

                .then(function(){
                    logger.info('Connection to database "%s" is successful.', config.get('mongoose:uri'));
                    return _this.requireModels();
                })

                .then(function(models) {
                    logger.info('Models (%s) were initialized.', models.join(', '));
                    resolve(mongoose.models);
                })

                .catch(function(error) {
                    logger.error("Can not init database.");
                    logger.error(error.stack ? error.stack : error);
                    reject(error);
                });
        });
    },


    /**
     * Reset database (open, drop, init models),
     * return list of models if resolve,
     * return error if fail.
     *
     * @returns {Promise}
     */

    reset: function () {

        var _this = this;

        return new Promise(function(resolve, reject) {
            _this.connect()

                .then(function(db){
                    logger.info('Connection to database "%s" is successful.', config.get('mongoose:uri'));
                    return _this.drop(db);
                })

                .then(function(){
                    logger.info('Database dropped is successful.');
                    return _this.requireModels();
                })

                .then(function(models) {
                    logger.info('Models (%s) were initialized.', models.join(', '));
                    resolve(mongoose.models);
                })

                .catch(function(error) {
                    logger.error("Can not reset database.");
                    logger.error(error.stack ? error.stack : error);
                    reject(error);
                });
        });
    },

    /**
     * Close connection.
     */
    disconect: function() {
        if(mongoose.connection.readyState != 0 && mongoose.connection.readyState != 3) {
            mongoose.disconect(function(){
                logger.info('Database connection was closed.')
            });
        } else {
            logger.info('Connecting to a database is already disabled.')
        }
    },


    /**
     * Defined models.
     */
    models: mongoose.models
}