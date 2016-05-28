var User = require('models/user'),
    Permission = require('models/permission'),
    config = require('config'),
    Promise = require('Promise'),
    permissionService = require('services/permission'),
    defaultSortColumn =  { sort : { firstName : 'asc'} };

module.exports = {

    /**
     * Validate and create new instance by properties.
     *
     * @param properties {Object}
     * @param properties.email {String}
     * @param properties.password {String}
     * @param properties.repeatPassword {String}
     * @param properties.firstName {String}
     * @param properties.secondName {String}
     * @param properties.enabled {Boolean}
     * @param properties.permissions {String[]}
     * @param properties.permissions[i] {String}
     * @returns {User}
     */
    validateAndCreate: function(properties) {
        //TODO: validate
        return new Promise(function(resolve, reject){
            var user = new User();

            user.email = properties.email;
            user.password = properties.password;
            user.firstName = properties.firstName;
            user.secondName = properties.secondName;
            user.enabled = properties.enabled;

            permissionService.getByKeys(properties.permissions)
                .then(function(objs){
                    user.addPermissions(objs);
                    resolve(user);
                }, function(err) {
                   reject(err);
                });
        });
    },

    /**
     * Get all users.
     *
     * @returns {Promise}
     */
    getAll: function() {
        return new Promise(function(resolve, reject) {
            User.find({}, null, defaultSortColumn)
                .populate('permissions')
                .exec(function(err, users) {

                err ? reject(err) : resolve(users ? users : []);
            });
        });
    },

    /**
     * Get user by id.
     *
     * @returns {Promise}
     */
    get: function(id) {
        return new Promise(function(resolve, reject) {
            User.findById(id)
                .populate('permissions')
                .exec( function(err, user) {

                err ? reject(err) : resolve(user);
            });
        });
    },

    /**
     * Get user by email.
     *
     * @param email {String}
     * @returns {Promise}
     */
    getByEmail: function(email) {
        return new Promise(function(resolve, reject) {
            User.findOne({ email: email })
                .populate('permissions')
                .exec( function(err, user) {

                    err ? reject(err) : resolve(user);
                });
        });
    },

    /**
     * Save user.
     *
     * @param user {User}
     * @returns {User}
     */
    save: function(user) {
        return new Promise(function(resolve, reject) {
            user.save(function(err, obj) {
                if(err) {
                    reject(err);
                } else {
                    User.findById(obj._id)
                        .populate('permissions')
                        .exec( function(err, obj) {

                        err ? reject(err) : resolve(obj);
                    });
                }
            });
        });
    }
}