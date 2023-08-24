const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');

const departmentController = require('../controllers/department.controller');
const multerConfig = require('../config/multerConfig');

router.use(cors());

router.post('/department', multerConfig.array('images', 3), departmentController.createDepartment);
router.get('/department', departmentController.getDepartments);
router.get('/department/:id', departmentController.getDepartmentById);
router.put('/department/:id', departmentController.changeOccupiedStatus);
router.delete('/department/:id', departmentController.deleteDepartment);

module.exports = router;
