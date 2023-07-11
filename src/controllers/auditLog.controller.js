const AuditLog = require('../models/auditlog.model');

function createAuditLog(req, res) {
    const { timestamp, iduser, ipAddress } = req.body;

    const auditLogEntry = new AuditLog({
        timestamp,
        iduser,
        ipAddress
    });

    auditLogEntry
        .save()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error al crear la entrada de registro de auditoría.', error: error.message });
        });
}

function getAuditLogs(req, res) {
    AuditLog
        .find()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error al obtener los registros de auditoría.', error });
        });
}

function getAuditLogById(req, res) {
    const { id } = req.params;

    AuditLog
        .findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'No se encontró la entrada de registro de auditoría.' });
            }
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error al obtener la entrada de registro de auditoría.', error });
        });
}

function updateAuditLog(req, res) {
    const { id } = req.params;
    const { timestamp, userId, ipAddress } = req.body;

    AuditLog
        .findByIdAndUpdate(id, { timestamp, userId, ipAddress }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'No se encontró la entrada de registro de auditoría.' });
            }
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error al actualizar la entrada de registro de auditoría.', error });
        });
}

function deleteAuditLog(req, res) {
    const { id } = req.params;

    AuditLog
        .findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'No se encontró la entrada de registro de auditoría.' });
            }
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error al eliminar la entrada de registro de auditoría.', error });
        });
}

module.exports = {
    createAuditLog,
    getAuditLogs,
    getAuditLogById,
    updateAuditLog,
    deleteAuditLog
};
