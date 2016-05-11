var mongoose = require('mongoose'),
    util = require('lib/util'),
    schema,
    properties;

properties = {
    clientId: { type: String, required: true, unique: true },
    clientSecret: { type: String, required: true, unique: true },
    creationDate: { type: Date, default: Date.now, required: true }
};

schema = new mongoose.Schema(properties);

schema.methods = {

    /**
     * Fill empty or override application, generate new client id and client secret, set creation date.
     *
     * @returns {Application}
     */
    fill: function() {

        this.clientId = util.generateKey(2);
        this.clientSecret = util.generateKey(3);
        this.creationDate = Date.new;

        return this;
    }
};

module.exports = mongoose.model('Application', schema);