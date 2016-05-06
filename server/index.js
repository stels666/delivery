var mongoose = require('lib/mongoose'),
    server = require('lib/server')(__dirname);

server.run()

    .then(function(){
        return mongoose.reset();
    })

    .then(function(models){

    })

    .catch(function(error) {
        mongoose.disconect();
        server.shutdown();
    });