var mongoose = require('mongoose'),
    util = require('lib/util'),
    schema,
    properties;

properties = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    secondName: { type: String }
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
    }
}

module.exports = mongoose.model('User', schema);