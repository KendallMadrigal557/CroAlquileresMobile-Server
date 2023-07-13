const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    place: { type: String, required: true },
    price: { type: Number, required: true },
    provincia: { type: String, required: true },
    canton: { type: String, required: true },
    distrito: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Department', departmentSchema);
