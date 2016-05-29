var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    name: { type: String, required: true},
    vendorCode: { type: String, required: true},
    cost: { type: Number, required: true },
    weight: {  type: Number, required: true },
    length: {  type: Number, required: true },
    width: {  type: Number, required: true },
    height: {  type: Number, required: true },
    quantity: {  type: Number, required: true }
};

schema = new mongoose.Schema(properties);

schema.methods = {};

module.exports = mongoose.model('Product', schema);