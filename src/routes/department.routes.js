const express = require('express');
const router = express.Router();
const cors = require('cors');

const departmentController = require('../controllers/department.controller');
const multerConfig = require('../config/multerConfig');

router.use(cors());

router.post('/department', multerConfig.single('image'), departmentController.validateDepartmentData, departmentController.createDepartment);
router.get('/department', departmentController.getDepartments);
router.get('/department/:id', departmentController.getDepartmentById);
router.put('/department/:id', departmentController.validateDepartmentData, departmentController.updateDepartment);
router.delete('/department/:id', departmentController.deleteDepartment);

module.exports = router;
