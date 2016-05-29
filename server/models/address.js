var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    settlement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Settlement',
        required: true
    },
    address: { type: String, required: true},
    comment: { type: String }
};

schema = new mongoose.Schema(properties);

schema.methods = {};

module.exports = mongoose.model('Address', schema);