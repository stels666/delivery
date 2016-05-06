var express = require('express'),
    engine = require('ejs-locals'),
    config = require('config'),
    Promise = require('promise'),
    logger = require('lib/logger')(module);
    HttpError = require('errors/HttpError'),
    Http404Error = require('errors/Http404Error'),
    Http500Error = require('errors/Http500Error'),
    app = express();


/**
 * Define middleware
 *
 * @param dirname {String} Root dir name.
 * @private
 */
function _defineMiddleware(dirname) {
    app.engine('ejs', engine);
    app.set('views', dirname + '/templates');
    app.set('view engine', 'ejs');

    app.use(express.static(dirname + '/public'));

    app.use(_pageNotFound);
    app.use(_convertToHttpError);
    app.use(_handleError);
}

/**
 * Page not found middleware.
 *
 * @param req
 * @param res
 * @private
 */
function _pageNotFound(req, res) {
    throw new Http404Error(req.url);
}


/**
 * Convert error to HttpError.
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @private
 */
function _convertToHttpError(err, req, res, next) {
    if(err instanceof HttpError) {
        /*
         * if error is instance of HttpError go to next middleware
         */
        next(err);
    } else {
        /*
         * if error isn't instance of HttpError convert to Http500Error
         */
        next(new Http500Error(err.message, err.stack));
    }
}


/**
 * Handle error middleware.
 *
 * @param err {HttpError}
 * @param req
 * @param res
 * @param next
 * @private
 */
function _handleError(err, req, res, next) {
    logger.error(err.toString());

    var showStack = !(err instanceof Http404Error);

    /*
     * Render html body
     */
    res.render('error', {
        code: err.code,
        message: err.message,
        header: config.get('project:name'),
        stack: err.stack,
        showStack: showStack
    }, function(error, html) {
        res.status(err.code).send(html);
    });
}

module.exports = function(root) {

    var server;

    _defineMiddleware(root);

    return {
        /**
         * Run server.
         *
         * @returns {Promise}
         */
        run: function () {
            return new Promise(function(resolve) {
                server = app.listen(config.get('server:port'), config.get('server:host'), function() {
                    logger.info('The server running at "http://%s:%d/"', config.get('server:host'), config.get('server:port'));
                    resolve();
                });
            });
        },

        /**
         * Shutdown the server.
         */
        shutdown: function() {
            if(server) {
                server.close(function(){
                    logger.info('The server has been shut down.')
                });
            } else {
                logger.info('The server is already closed.')
            }
        }

    };
};


