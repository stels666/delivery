var util = require('util'),
    DeliveryError = require('errors/DeliveryError');


/**
 * Http exception class.
 *
 * @param code {Number} http status code.
 * @param message {String} General message.
 * @param internalCode {Number} Internal error code.
 * @param internalMessage {Number} Internal message, detail about error.
 * @param stack
 * @constructor
 */
function HttpError(code, message, internalCode, internalMessage, stack) {

    this.code = code;
    this.message = message;
    this.internalCode = internalCode;
    this.internalMessage = internalMessage;
    this.stack = stack;

    if(!stack) {
        Error.captureStackTrace(this, HttpError);
    }
}

util.inherits(HttpError, DeliveryError);

HttpError.prototype = {

    name: 'HttpError',

    description: function() {
        var description = "";

        description += this.code ? this.code + ' ' : description;
        description += this.message ? this.message + ': ' : description;
        description += this.internalCode ? this.internalCode + ' ' : description;
        description += this.internalMessage ? this.internalMessage : description;

        return description;
    }
};

module.exports = HttpError;