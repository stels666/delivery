var User = require('models/user'),
    config = require('config'),
    Promise = require('Promise'),
    defaultSortColumn =  { sort : { firstName : 'asc'} };

module.exports = {

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
    }
}