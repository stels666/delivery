var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    countryCode: { type: String, required: true},
    country: { type: String, required: true},
    areaType: { type: String},
    areaTypeShort: { type: String},
    area: { type: String},
    district: { type: String },
    districtType: { type: String },
    districtTypeShort: { type: String },
    settlementType: { type: String, required: true},
    settlementTypeShort: { type: String, required: true},
    name: { type: String, required: true},
    postcode: { type: String, required: true},
    latitude: { type: String, required: true},
    longitude: { type: String, required: true},
    main: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Settlement'
    },
    coefficient: { type: Number, required: true }
};

schema = new mongoose.Schema(properties);

schema.methods = {

    /**
     * Get json response form.
     *
     * @returns {Object}
     */
    toResponse: function(full) {
        var response = {
            id: this._id,
            countryCode: this.countryCode,
            country: this.country,
            areaType: this.areaType,
            areaTypeShort: this.areaTypeShort,
            area: this.area,
            district: this.district,
            districtType: this.districtType,
            districtTypeShort: this.districtTypeShort,
            settlementType: this.settlementType,
            settlementTypeShort: this.settlementTypeShort,
            name: this.name,
            postcode: this.postcode,
            latitude: this.latitude,
            longitude: this.longitude,
            coefficient: this.coefficient
        };

        if(this.main) {
            response.main = this.main.toResponse(full);
        }

        return response;
    }
};

module.exports = mongoose.model('Settlement', schema);