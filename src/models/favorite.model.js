const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    iduser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    idDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }
});

module.exports = mongoose.model("Favorite", favoriteSchema);
