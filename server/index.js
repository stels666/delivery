var mongoose = require('lib/mongoose'),
    server = require('lib/server')(__dirname),
    initializer = require('lib/initializer'),
    logger = require('lib/logger')(module);

mongoose.reset()

    .then(function(models){
        return initializer.defaultDBState(models);
    })

    .then(function(objs){
        return server.run();
    })

    .catch(function(error) {
        logger.error(error);
        mongoose.disconect();
        server.shutdown();
    });



