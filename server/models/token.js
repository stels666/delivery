var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    accessToken: { type: String, required: true, unique: true },
    creationDate: { type: Date, default: Date.now }
};

schema = new mongoose.Schema(properties);

module.exports = mongoose.model('Token', schema);