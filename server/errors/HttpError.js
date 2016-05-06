var util = require('util');

function HttpError(code, message) {
    this.code = code;
    this.message = message;
    Error.captureStackTrace(this, HttpError);
}

util.inherits(HttpError, Error);

HttpError.prototype = {

    name: 'HttpError',

    toString: function(){
        return this.stack ? this.stack : this.toString();
    }
};

module.exports = HttpError;