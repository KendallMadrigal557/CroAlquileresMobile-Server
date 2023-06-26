const bcrypt = require('bcryptjs');
const userSchema = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kendallmadrigal14@gmail.com',
        pass: ''
    }
});

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

    userSchema.findOne({ email: lowercaseEmail })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const user = new userSchema({
                name: name,
                email: lowercaseEmail,
                password: hashedPassword
            });

            user.save()
                .then((data) => res.json(data))
                .catch((error) => res.json({ message: error }));
        })
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

async function enableTwoFactor(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    const verificationCode = generateVerificationCode();

    try {
        const user = await userSchema.findByIdAndUpdate(
            id,
            { $set: { isTwoFactorEnabled: true, verificationCode: verificationCode } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        await sendVerificationCodeByEmail(email, verificationCode);

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendVerificationCodeByEmail(email, verificationCode) {
    const mailOptions = {
        from: 'kendallmadrigal14@gmail.com',
        to: email,
        subject: 'CroAlquileres - Código de verificación de doble factor',
        html: `
            <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif; width: 572px; height: 297px; margin: 0 auto; text-align: center;">
            <h2 style="color: #333333;">CroAlquileres</h2>
                <p>Hola,</p>
                <p>Tu código de verificación de doble factor en CroAlquileres App es: <strong>${verificationCode}</strong></p>
                <p>Utiliza este código para completar tu proceso de verificación de seguridad.</p>
                <br>
                <p>Gracias,</p>
                <p>El equipo de CroAlquileres</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error a la hora del envio de correo');
        } else {
            console.log('Correo electrónico enviado');
        }
    });
}



async function loginUser(req, res) {
    const { email, password, twoFactorCode } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
    }

    try {
        const user = await userSchema.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        if (user.isTwoFactorEnabled) {
            if (!twoFactorCode) {
                return res.status(400).json({ message: 'Se requiere el código de verificación de doble factor.' });
            }

            if (twoFactorCode !== user.verificationCode) {
                return res.status(401).json({ message: 'Código de verificación de doble factor inválido.' });
            }
        }

        const token = jwt.sign({ userId: user._id }, 'secretKey');

        res.json({ token: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    validateUserData,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    enableTwoFactor,
    loginUser
};