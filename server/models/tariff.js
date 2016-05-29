var mongoose = require('mongoose'),
    schema,
    properties;

properties = {
    weightMin: { type: Number, required: true },
    weightMax: { type: Number, required: true },
    volumeMin: { type: Number, required: true },
    volumeMax: { type: Number, required: true },
    costMin: { type: Number, required: true },
    costMax: { type: Number, required: true },
    lengthMax: {  type: Number, required: true },
    widthMax: { type: Number, required: true },
    heightMax: {  type: Number, required: true },
    tariff: { type: Number, required: true }
};

schema = new mongoose.Schema(properties);

schema.methods = {

    /**
     * Get json response form.
     *
     * @returns {Object}
     */
    toResponse: function(full) {
        return {
            id: this._id,
            weightMin: this.weightMin,
            weightMax: this.weightMax,
            volumeMin: this.volumeMin,
            volumeMax: this.volumeMax,
            costMin: this.costMin,
            costMax: this.costMax,
            lengthMax: this.lengthMax,
            widthMax: this.widthMax,
            heightMax: this.heightMax,
            tariff: this.tariff
        };
    }
};

module.exports = mongoose.model('Tariff', schema);