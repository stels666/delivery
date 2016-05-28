var mongoose = require('mongoose'),
    schema,
    properties,
    Permission;

properties = {
    key: { type: String, required: true, unique: true},
    description: { type: String }
};

schema = new mongoose.Schema(properties);

schema.statics.all = function(){
    return [
        Permission.SUPER,
        Permission.USER_GET,
        Permission.USER_CREATE,
        Permission.USER_EDIT,
        Permission.USER_REMOVE
    ];
}

schema.methods = {

    /**
     * Get json response form.
     *
     * @returns {Object}
     */
    toResponse: function(full) {
        var response = {
            key: this.key,
            description: this.description
        };

        if(full) {
            response.id = this._id;
        }

        return response;
    }
};

Permission = mongoose.model('Permission', schema);

Permission.SUPER = new Permission({ key: 'SUPER', description: 'Access to all resources.'});
Permission.USER_GET = new Permission({ key: 'USER_GET', description: 'Access to user(s).'});
Permission.USER_CREATE = new Permission({ key: 'USER_CREATE', description: 'Access to create user(s).'});
Permission.USER_EDIT = new Permission({ key: 'USER_EDIT', description: 'Access to edit user(s).'});
Permission.USER_REMOVE = new Permission({ key: 'USER_REMOVE', description: 'Access to remove user(s).'});

module.exports = Permission;