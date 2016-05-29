var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    email: { type: String, required: true},
    phone: {  type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true }
};

schema = new mongoose.Schema(properties);

schema.methods = {};

module.exports = mongoose.model('Client', schema);