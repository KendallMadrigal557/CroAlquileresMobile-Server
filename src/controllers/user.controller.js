const bcrypt = require('bcryptjs');
const userSchema = require('../models/user.model');

function validateUserData(req, res, next) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const nameRegex = /^[a-zA-Zá-úÁ-Ú\s]*$/;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: 'El nombre no puede contener números.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'El correo electrónico no tiene un formato válido.' });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.' });
    }
    next();
}

function createUser(req, res) {
    const { name, email, password } = req.body;
    const lowercaseEmail = email.toLowerCase();

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new userSchema({
        name: name,
        email: lowercaseEmail,
        password: hashedPassword 
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
    
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    userSchema
        .findByIdAndUpdate(id, { $set: { name, email, password: hashedPassword } }, { new: true })
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
