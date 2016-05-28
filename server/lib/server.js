var express = require('express'),
    bodyParser = require('body-parser'),
    engine = require('ejs-locals'),
    config = require('config'),
    Promise = require('promise'),
    logger = require('lib/logger')(module),
    DeliveryError = require('errors/HttpError'),
    HttpError = require('errors/HttpError'),
    Http400Error = require('errors/Http400Error'),
    Http404Error = require('errors/Http404Error'),
    Http500Error = require('errors/Http500Error'),
    Http403Error = require('errors/Http403Error'),
    app = express();

function _defineControllers() {
    require('controllers/auth')(app);
    require('controllers/user')(app);
    require('controllers/application')(app);
}

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

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(express.static(dirname + '/public'));

    app.use(_watcher);

    _defineControllers();

    app.use(_pageNotFound);
    app.use(_convertToHttpError);
    app.use(_handleError);
}

/**
 * Main middleware.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function _watcher(req, res, next) {
    logger.info('METHOD "%s", URL "%s"', req.method, req.path);
    next();
}


/**
 * Page not found middleware.
 *
 * @param req
 * @param res
 * @private
 */
function _pageNotFound(req, res) {
    throw new Http404Error(config.get('errors:pageNotFound'), 'Page "' + req.path + '" not found.');
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
    } else if(err instanceof DeliveryError) {
        /*
         * if error is instance of DeliveryError, convert to Http500Error
         */
        next(new Http500Error(err.internalCode, err.internalMessage, err.stack));
    } else {
        /*
         * if error isn't instance of DeliveryError and HttpError convert to Http500Error
         */
        next(new Http500Error(config.get('errors:unknown'), err.message, err.stack));
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

    var showStack = !(err instanceof Http404Error ||
                        err instanceof Http400Error ||
                        err instanceof Http403Error);
    showStack ? logger.error(err.stack) : logger.error(err.description());

    /*
     * Render html body
     */
    res.render('error',
    {
        code: err.code,
        message: err.message,
        header: config.get('project:name'),
        detail: err.internalCode + ' ' + err.internalMessage,
        stack: err.stack,
        showStack: showStack
    },

    function(error, html) {

        if(!err.internalCode) {
            logger.warn('Error with unknown internal code, will set default (%s).', config.get('errors:unknown'));
            res.setHeader('internalCode', config.get('errors:unknown'));
        } else {
            res.setHeader('internalCode', err.internalCode);
        }

        err.internalMessage ? res.setHeader('internalMessage', err.internalMessage) : '';

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


