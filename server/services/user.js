var User = require('models/user'),
    config = require('config'),
    Promise = require('Promise'),
    baseObjectProjection = 'email password firstName secondName',
    defaultSortColumn =  { sort : { firstName : 'asc'} };

module.exports = {

    /**
     * Get all users.
     *
     * @returns {Promise}
     */
    getAll: function() {
        return new Promise(function(resolve, reject) {
            User.find({}, baseObjectProjection, defaultSortColumn, function(err, users){
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
            User.findById(id, baseObjectProjection, null, function(err, user){
                err ? reject(err) : resolve(user);
            });
        });
    }
}