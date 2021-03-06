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

        Permission.PERMISSION_GET,

        Permission.TOKEN_GET,
        Permission.TOKEN_REMOVE,

        Permission.APPLICATION_GET,
        Permission.APPLICATION_CREATE,
        Permission.APPLICATION_EDIT,
        Permission.APPLICATION_REMOVE,

        Permission.USER_GET,
        Permission.USER_CREATE,
        Permission.USER_EDIT,
        Permission.USER_REMOVE,

        Permission.TARIFF_GET,
        Permission.TARIFF_CREATE,
        Permission.TARIFF_EDIT,
        Permission.TARIFF_REMOVE,

        Permission.SETTLEMENT_GET,
        Permission.SETTLEMENT_CREATE,
        Permission.SETTLEMENT_EDIT,
        Permission.SETTLEMENT_REMOVE
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

Permission.PERMISSION_GET = new Permission({ key: 'PERMISSION_GET', description: 'Access to permission(s).'});

Permission.TOKEN_GET = new Permission({ key: 'TOKEN_GET', description: 'Access to token(s).'});
Permission.TOKEN_REMOVE = new Permission({ key: 'TOKEN_REMOVE', description: 'Access to remove token(s).'});

Permission.APPLICATION_GET = new Permission({ key: 'APPLICATION_GET', description: 'Access to application(s).'});
Permission.APPLICATION_CREATE = new Permission({ key: 'APPLICATION_CREATE', description: 'Access to create application(s).'});
Permission.APPLICATION_EDIT = new Permission({ key: 'APPLICATION_EDIT', description: 'Access to edit application(s).'});
Permission.APPLICATION_REMOVE = new Permission({ key: 'APPLICATION_REMOVE', description: 'Access to remove application(s).'});

Permission.USER_GET = new Permission({ key: 'USER_GET', description: 'Access to user(s).'});
Permission.USER_CREATE = new Permission({ key: 'USER_CREATE', description: 'Access to create user(s).'});
Permission.USER_EDIT = new Permission({ key: 'USER_EDIT', description: 'Access to edit user(s).'});
Permission.USER_REMOVE = new Permission({ key: 'USER_REMOVE', description: 'Access to remove user(s).'});

Permission.TARIFF_GET = new Permission({ key: 'TARIFF_GET', description: 'Access to tariff(s).'});
Permission.TARIFF_CREATE = new Permission({ key: 'TARIFF_CREATE', description: 'Access to create tariff(s).'});
Permission.TARIFF_EDIT = new Permission({ key: 'TARIFF_EDIT', description: 'Access to edit tariff(s).'});
Permission.TARIFF_REMOVE = new Permission({ key: 'TARIFF_REMOVE', description: 'Access to remove tariff(s).'});

Permission.SETTLEMENT_GET = new Permission({ key: 'SETTLEMENT_GET', description: 'Access to settlement(s).'});
Permission.SETTLEMENT_CREATE = new Permission({ key: 'SETTLEMENT_CREATE', description: 'Access to create settlement(s).'});
Permission.SETTLEMENT_EDIT = new Permission({ key: 'SETTLEMENT_EDIT', description: 'Access to edit settlement(s).'});
Permission.SETTLEMENT_REMOVE = new Permission({ key: 'SETTLEMENT_REMOVE', description: 'Access to remove settlement(s).'});

module.exports = Permission;