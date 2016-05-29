var permissionService = require('services/permission').newInstance();


module.exports = {
    getPermissionService: function() {
        return permissionService;
    }
};