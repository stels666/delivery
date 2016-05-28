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
        Permission.OWNER,
        Permission.USER_GET
    ];
}

Permission = mongoose.model('Permission', schema);

Permission.SUPER = new Permission({ key: 'SUPER', description: 'Access to all resources.'});
Permission.OWNER = new Permission({ key: 'OWNER_GET', description: 'Access to object(s) if owner.'});
Permission.USER_GET = new Permission({ key: 'USER_GET', description: 'Access to user(s).'});

module.exports = Permission;