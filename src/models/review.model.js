const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    idDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
