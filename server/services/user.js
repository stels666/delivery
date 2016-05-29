var User = require('models/user'),
    AbstractService = require('services/abstract'),
    util = require('lib/util'),
    factory = require('services/factory');

util.node.inherits(UserService, AbstractService);

/**
 *
 * @constructor
 */
function UserService() {
    AbstractService.call(this, User, [ 'permissions' ]);
}

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
 * @returns {Promise}
 */
UserService.prototype.validateAndCreate = function(properties) {
    //TODO: validate
    return this.newPromise(function(resolve, reject){
        var user = new User();

        user.email = properties.email;
        user.password = properties.password;
        user.firstName = properties.firstName;
        user.secondName = properties.secondName;
        user.enabled = properties.enabled;

        factory.getPermissionService().getByKeys(properties.permissions)
            .then(function(objs){
                user.addPermissions(objs);
                resolve(user);
            }, function(err) {
               reject(err);
            });
    });
};

/**
 * Get user by email.
 *
 * @param email {String}
 * @returns {Promise}
 */
UserService.prototype.getByEmail = function(email) {
    var _this = this;

    return this.newPromise(function(resolve, reject) {
        User.findOne({ email: email })
            .populate(_this.populateToString())
            .exec( function(err, user) {

                err ? reject(err) : resolve(user);
            });
    });
};


UserService.newInstance = function() {
    return new UserService();
};

module.exports = UserService;