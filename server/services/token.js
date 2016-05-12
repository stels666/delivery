var Token = require('models/token');

module.exports = {

    /**
     * Create new filled token.
     *
     * @param user {User}
     */
    createToken: function(user, application) {
        return Token.newInstance(user, application);
    }
}