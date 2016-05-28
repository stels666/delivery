var mongoose = require('mongoose'),
    util = require('lib/util'),
    schema,
    properties;

properties = {
    clientId: { type: String, required: true, unique: true },
    clientSecret: { type: String, required: true, unique: true },
    creationDate: { type: Date, default: new Date(), required: true },
    enabled: { type: Boolean, default: true },
    native: { type: Boolean, default: false }
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
        this.enabled = true;
        this.native = false;

        return this;
    },

    toResponse: function(full) {
        return {
            id: this._id,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            creationDate: this.creationDate,
            enabled: this.enabled,
            native: this.native
        };
    }
};

module.exports = mongoose.model('Application', schema);