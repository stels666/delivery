var mongoose = require('mongoose'),
    util = require('lib/util'),
    schema,
    properties;

properties = {
    accessToken: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: true, unique: true },
    creationDate: { type: Date, default: Date.now, required: true },
    expiresIn : { type : Number, required : true },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },

    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required : true
    }

};


schema = new mongoose.Schema(properties);

schema.statics = {

    /**
     *
     * @param user
     * @param application
     * @returns {Token}
     */
    newInstance: function(user, application) {

        if((user == null && typeof user !== 'object') ||
            (application == null && typeof application !== 'object')) {

            return;
        }

        return new this({ userId: user._sid, applicationId: application._id }).fill();
    }
};

schema.methods = {

    /**
     * Fill empty or override token, generate new access token and refresh token, set creation date and expires in.
     *
     * @returns {Tiket}
     */
    fill: function() {

        this.accessToken = util.generateKey(0);
        this.refreshToken = util.generateKey(1);
        this.creationDate = Date.new;
        this.expiresIn = config.get('keys:tokenExpiresIn');

        return this;
    },


    /**
     * Get json response form.
     *
     * @returns {{access_token: string, expires_in: number, refresh_token: string}}
     */
    toResponse: function() {
        return {
            access_token: this.accessToken,
            expires_in: this.expiresIn,
            refresh_token: this.refreshToken
        };
    },


    /**
     * Expiries checking
     *
     * @returns {boolean}
     */
    isExpired: function() {

        var startTime = this.creationDate.getTime(),
            finishTime = startTime + this.expiresIn * 1000,
            currentTime = Date().new.getTime();

        return currentTime > finishTime;
    }
};

module.exports = mongoose.model('Token', schema);