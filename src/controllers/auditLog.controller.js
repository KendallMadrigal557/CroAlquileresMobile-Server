const AuditLog = require('../models/auditlog.model');

function createAuditLog(req, res) {
    const { timestamp, userId, ipAddress } = req.body;

    const auditLogEntry = new AuditLog({
        timestamp,
        userId,
        ipAddress
    });

    auditLogEntry
        .save()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
}

function getAuditLogs(req, res) {
    AuditLog
        .find()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
}

function getAuditLogById(req, res) {
    const { id } = req.params;

    AuditLog
        .findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Audit log entry not found.' });
            }
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
}

function updateAuditLog(req, res) {
    const { id } = req.params;
    const { timestamp, userId, ipAddress } = req.body;

    AuditLog
        .findByIdAndUpdate(id, { timestamp, userId, ipAddress }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Audit log entry not found.' });
            }
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
}

function deleteAuditLog(req, res) {
    const { id } = req.params;

    AuditLog
        .findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Audit log entry not found.' });
            }
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
}

module.exports = {
    createAuditLog,
    getAuditLogs,
    getAuditLogById,
    updateAuditLog,
    deleteAuditLog
};
