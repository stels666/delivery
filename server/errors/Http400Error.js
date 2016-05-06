var util = require('util'),
    HttpError = require('errors/HttpError');


/**
 * Http 400 (Bad Request) exception class.
 *
 * @param internalCode {Number} Internal error code.
 * @param internalMessage {Number} Internal message, detail about error.
 * @param stack
 * @constructor
 */
function Http400Error(internalCode, internalMessage, stack) {
    HttpError.apply(this, [400, 'Bad Request', internalCode, internalMessage, stack]);
    Error.captureStackTrace(this, Http400Error);
}

util.inherits(Http400Error, HttpError);
Http400Error.prototype.name = 'Http400Error';

module.exports = Http400Error;