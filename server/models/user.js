var mongoose = require('mongoose'),
    util = require('lib/util'),
    schema,
    properties;

properties = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    secondName: { type: String },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }]
};

schema = new mongoose.Schema(properties);

/*
 * Generate password hash.
 */
schema.pre('save', function(next) {
    var _this = this;

    // only hash the password if it has been modified (or is new)
    if (!_this.isModified('password')) {
        return next();
    }

    // generate a salt
    util.generateSalt()

        .then(function(salt){
            // hash the password using our new salt
            return util.generateHash(_this.password, salt);
        })

        .then(function(hash) {
            // override the cleartext password with the hashed one
            _this.password = hash;
            next();
        })

        .catch(function(error) {
            next(error);
        });
});


schema.methods = {

    /**
     * Compare password
     *
     * @param pass
     * @returns {Promise}
     */
    comparePasswords: function(pass) {
        return util.compareHashed(pass, this.password);
    },

    /**
     * Add permissions to list.
     *
     * @param permissions {Permission[]}
     */
    addPermissions: function(permissions) {
        var _this = this;

        permissions.forEach(function(item){
            _this.addPermission(item);
        });
    },

    /**
     * Add permission to list
     *
     * @param permission {Permission}
     */
    addPermission: function(permission) {
        this.permissions.push(permission._id);
    },

    /**
     * Check access by permission key.
     *
     * @param key
     * @returns {boolean}
     */
    isAccessAllowed: function(key) {
        for(var i = 0, max = this.permissions.length; i < max; i += 1 ){
            if(this.permissions[i].key === key) {
                return true;
            }
        }
        return false;
    }
}

module.exports = mongoose.model('User', schema);