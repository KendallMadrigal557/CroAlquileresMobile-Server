const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');

const auditLogController = require('../controllers/auditLog.controller');

router.use(cors());

router.post('/audit-log', multer().none(), auditLogController.createAuditLog);
router.get('/audit-log', auditLogController.getAuditLogs);
router.get('/audit-log/:id', auditLogController.getAuditLogById);
router.put('/audit-log/:id', multer().none(), auditLogController.updateAuditLog);
router.delete('/audit-log/:id', auditLogController.deleteAuditLog);

module.exports = router;
