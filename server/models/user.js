var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    secondName: { type: String }
};

schema = new mongoose.Schema(properties);

module.exports = mongoose.model('User', schema);