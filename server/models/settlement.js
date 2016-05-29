var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    country: { type: String, required: true},
    areaType: { type: String},
    areaTypeShort: { type: String},
    area: { type: String},
    district: { type: String },
    districtType: { type: String },
    districtTypeShort: { type: String },
    settlementType: { type: String, required: true},
    settlementTypeShort: { type: String, required: true},
    settlement: { type: String, required: true},
    postcode: { type: String, required: true}
};

schema = new mongoose.Schema(properties);

schema.methods = {};

module.exports = mongoose.model('Settlement', schema);