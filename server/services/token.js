var Token = require('models/token'),
    config = require('config'),
    Http500Error = require('errors/Http500Error');

module.exports = {

    /**
     * Get new filled token.
     *
     * @param user {User}
     */
    newToken: function(user, application) {

        if((user == null && typeof user !== 'object') ||
            (application == null && typeof application !== 'object')) {

            throw new Http500Error(config.get('errors:invalidArguments'), 'Invalid arguments.');
        }

        return new Token({ userId: user._sid, applicationId: application._id }).fill();
    }
}