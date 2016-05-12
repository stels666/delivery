var util = require('util'),
    HttpError = require('errors/HttpError');


/**
 * Http 403 (Forbidden) exception class.
 *
 * @param internalCode {Number} Internal error code.
 * @param internalMessage {Number} Internal message, detail about error.
 * @param stack
 * @constructor
 */
function Http403Error(internalCode, internalMessage, stack) {

    this.code = 403;
    this.message = 'Forbidden';
    this.internalCode = internalCode;
    this.internalMessage = internalMessage;
    this.stack = stack;

    if(!stack) {
        Error.captureStackTrace(this, Http403Error);
    }
}

util.inherits(Http403Error, HttpError);
Http403Error.prototype.name = 'Http403Error';

module.exports = Http403Error;