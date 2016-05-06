module.exports = {

    /**
     * Validate parameters, check if parameter is null.
     *
     * @param parameters
     * @returns {Array}
     */
    requires: function(parameters){
        var names = [];

        for(var i = 0, max = parameters.length; i < max; i += 1) {
            if(parameters[i].value == null) {
                names.push(parameters[i].name);
            }
        }

        return names;
    }
}