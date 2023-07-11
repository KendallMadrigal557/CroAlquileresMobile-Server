const mongoose = require("mongoose");

const distritoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
});

const cantonSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    distritos: [distritoSchema],
});

const placeSchema = new mongoose.Schema({
    provincia: { type: String, required: true },
    cantones: [cantonSchema],
});


module.exports = mongoose.model('Place', placeSchema);
