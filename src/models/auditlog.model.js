const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    time: { type: Date , default: Date.now  },
    iduser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String },
});

module.exports = mongoose.model('AuditLog', departmentSchema);
