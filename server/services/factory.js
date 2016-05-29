var permissionService = require('services/permission').newInstance(),
    applicationService = require('services/application').newInstance(),
    tokenService = require('services/token').newInstance(),
    userService = require('services/user').newInstance(),
    tariffService = require('services/tariff').newInstance();

module.exports = {

    getPermissionService: function() {
        return permissionService;
    },

    getApplicationService: function() {
        return applicationService;
    },

    getTokenService: function() {
        return tokenService;
    },

    getUserService: function() {
        return userService;
    },

    getTariffService: function() {
        return tariffService;
    }
};