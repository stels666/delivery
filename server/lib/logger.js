var log4js = require('log4js');
    config = require('config');

log4js.configure(config.get('log4js'));

/**
 * Get logger by module name, if module is undefined, logger name will be [default].
 *
 * @param module {Object} Module meta data.
 * @returns {Logger}
 */
module.exports = function(module) {

    var name = module ? module.filename : '[default]',
        key = '/delivery/server/' /* application path */,
        keyIndex = name.indexOf(key);


    name = keyIndex != -1 ? '[' + name.substr(keyIndex + key.length) + ']' : name;

    return log4js.getLogger(name);
};