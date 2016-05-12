var mongoose = require('mongoose'),
    util = require('lib/util'),
    schema,
    properties;

properties = {
    clientId: { type: String, required: true, unique: true },
    clientSecret: { type: String, required: true, unique: true },
    creationDate: { type: Date, default: new Date(), required: true },
    enabled: { type: Boolean, default: true }
};

schema = new mongoose.Schema(properties);

schema.statics = {

    /**
     *
     * @returns {Application}
     */
    newInstance: function() {
        return new this().fill();
    }
};

schema.methods = {

    /**
     * Fill empty or override application, generate new client id and client secret, set creation date.
     *
     * @returns {Application}
     */
    fill: function() {

        this.clientId = util.generateKey(2);
        this.clientSecret = util.generateKey(3);
        this.creationDate = new Date();

        return this;
    }
};

module.exports = mongoose.model('Application', schema);