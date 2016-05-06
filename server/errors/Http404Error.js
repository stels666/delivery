var util = require('util'),
    HttpError = require('errors/HttpError');

function Http404Error(url) {
    var message = url ? 'Page "' + url + '" Not Found' : 'Not Found';
    this.url = url;
    HttpError.apply(this, [404, message])
    Error.captureStackTrace(this, Http404Error);
}

util.inherits(Http404Error, HttpError);
Http404Error.prototype.name = 'Http404Error';

module.exports = Http404Error;