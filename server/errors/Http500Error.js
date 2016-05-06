var util = require('util'),
    HttpError = require('errors/HttpError');

function Http500Error(message, stack) {
    var message = message ? 'Internal Server Error, ' + message : 'Internal Server Error';
    this.stack = stack;
    HttpError.apply(this, [500, message])
    Error.captureStackTrace(this, Http500Error);
}

util.inherits(Http500Error, HttpError);
Http500Error.prototype.name = 'Http500Error';

module.exports = Http500Error;