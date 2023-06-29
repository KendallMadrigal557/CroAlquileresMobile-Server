const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    timestamp: { type: Date , default: Date.now  },
    iduser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
