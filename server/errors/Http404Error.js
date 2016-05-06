var util = require('util'),
    HttpError = require('errors/HttpError');


/**
 * Http 404 (Not Found) exception class.
 *
 * @param internalCode {Number} Internal error code.
 * @param internalMessage {Number} Internal message, detail about error.
 * @param stack
 * @constructor
 */
function Http404Error(internalCode, internalMessage, stack) {
    HttpError.apply(this, [404, 'Not Found', internalCode, internalMessage, stack]);
    Error.captureStackTrace(this, Http404Error);
}

util.inherits(Http404Error, HttpError);
Http404Error.prototype.name = 'Http404Error';

module.exports = Http404Error;