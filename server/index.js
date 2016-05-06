var mongoose = require('lib/mongoose'),
    server = require('lib/server')(__dirname),
    initializer = require('lib/initializer');

mongoose.reset()

    .then(function(models){
        return initializer.defaultDBState(models);
    })

    .then(function(){
        return server.run();
    })

    .catch(function(error) {
        mongoose.disconect();
        server.shutdown();
    });



