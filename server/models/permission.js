var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    key: { type: String, required: true, unique: true},
    description: { type: String }
};

schema = new mongoose.Schema(properties);

schema.methods = {

}

module.exports = mongoose.model('Permission', schema);