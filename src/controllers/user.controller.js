const userSchema = require('../models/user.model');

function validateUserData(req, res, next) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'El correo electrónico no tiene un formato válido.' });
    }

    next();
}

function createUser(req, res) {
    const user = new userSchema({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getUsers(req, res) {
    userSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getUserById(req, res) {
    const { id } = req.params;
    userSchema
        .findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password } = req.body;
    userSchema
        .findByIdAndUpdate(id, { $set: { name, email, password } }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function deleteUser(req, res) {
    const { id } = req.params;
    userSchema
        .findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

module.exports = {
    validateUserData,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
