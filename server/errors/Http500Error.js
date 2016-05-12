var util = require('util'),
    HttpError = require('errors/HttpError');


/**
 * Http 500 (Internal Server Error) exception class.
 *
 * @param internalCode {Number} Internal error code.
 * @param internalMessage {Number} Internal message, detail about error.
 * @param stack
 * @constructor
 */
function Http500Error(internalCode, internalMessage, stack) {

    this.code = 500;
    this.message = 'Internal Server Error';
    this.internalCode = internalCode;
    this.internalMessage = internalMessage;
    this.stack = stack;

    if(!stack) {
        Error.captureStackTrace(this, Http500Error);
    }
}

util.inherits(Http500Error, HttpError);
Http500Error.prototype.name = 'Http500Error';

module.exports = Http500Error;