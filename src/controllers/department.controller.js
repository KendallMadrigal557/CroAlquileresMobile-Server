const departmentSchema = require('../models/department.model');

function validateDepartmentData(req, res, next) {
    const { place, price, provincia, canton, distrito, description, status } = req.body;
    console.log(req.files, req.body);
    const allowedExtensions = ['jpg', 'png', 'jpeg'];

    if (!place || !price || !provincia || !canton || !distrito || !description || !status || !req.files || req.files.length < 1) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios, incluyendo la imagen.' });
    }

    const fileExtensionsValid = req.files.every(file => {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    });

    if (!fileExtensionsValid) {
        return res.status(400).json({ message: 'El formato del archivo no es válido. Se permiten solo archivos JPG, PNG y JPEG.' });
    }

    next();
}

function createDepartment(req, res) {
    const { place, price, provincia, canton, distrito, description, status, rooms, capacity, isOccupied } = req.body;
    console.log(req.body);

    const images = req.files.map(file => file.filename);

    const department = new departmentSchema({
        place,
        price,
        provincia,
        canton,
        distrito,
        description,
        status,
        images,
        rooms,
        capacity,
        isOccupied
    });

    department
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}


function getDepartments(req, res) {
    departmentSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
};

function getDepartmentById(req, res) {
    const { id } = req.params;
    departmentSchema
        .findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Departamento no encontrado.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
};

function updateDepartment(req, res) {
    const { id } = req.params;
    const { place, price, provincia, canton, distrito, description, status } = req.body;
    departmentSchema
        .findByIdAndUpdate(id, { $set: { place, price, provincia, canton, distrito, description, status } }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Departamento no encontrado.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
};

function deleteDepartment(req, res) {
    const { id } = req.params;
    departmentSchema
        .findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Departamento no encontrado.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
};

function changeOccupiedStatus(req, res) {
    const { id } = req.params;
    const { isOccupied } = req.body;
    departmentSchema
        .findByIdAndUpdate(id, { $set: { isOccupied } }, { new: true }) 
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Departamento no encontrado.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

module.exports = {
    validateDepartmentData,
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    changeOccupiedStatus,
};
