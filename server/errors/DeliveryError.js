var util = require('util');

/**
 * Main exception class.
 *
 * @param message {String} General message.
 * @param internalCode {Number} Internal error code.
 * @param internalMessage {Number} Internal message, detail about error.
 * @param stack
 * @constructor
 */
function DeliveryError(message, internalCode, internalMessage, stack) {

    this.internalCode = internalCode;
    this.message = message;
    this.internalMessage = internalMessage;
    this.stack = stack;

    if(!stack) {
        Error.captureStackTrace(this, DeliveryError);
    }
}

util.inherits(DeliveryError, Error);

DeliveryError.prototype = {

    name: 'DeliveryError',

    toString: function(){
        return this.stack ? this.stack : this.toString();
    },

    description: function() {
        var description = "";

        description += this.internalCode ? this.internalCode + ' ' : description;
        description += this.message ? (this.internalMessage ? this.message + ': ' : this.message + '.') : description;
        description += this.internalMessage ? this.internalMessage : description;

        return description;
    }
};

module.exports = DeliveryError;