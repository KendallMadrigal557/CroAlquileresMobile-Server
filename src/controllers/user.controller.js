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
    const { name, email, password, passwordDuration } = req.body;
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

            if (passwordDuration === 30 || passwordDuration === 60 || passwordDuration === 90) {
                user.setPasswordExpiration(passwordDuration);
            } else {
                return res.status(400).json({ message: 'Duración de contraseña inválida. Debe ser 30, 60 o 90 días.' });
            }

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

    userSchema.findById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            if (password && user.passwordHistory.includes(password)) {
                return res.status(400).json({ message: 'La contraseña no puede ser igual a las contraseñas anteriores.' });
            }

            const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

            userSchema.findByIdAndUpdate(id, { $set: { name, email, password: hashedPassword } }, { new: true })
                .then((updatedUser) => {
                    res.json(updatedUser);
                })
                .catch((error) => {
                    res.status(500).json({ message: error.message });
                });
        })
        .catch((error) => {
            res.status(500).json({ message: error.message });
        });
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

async function verifyTwoFactorCode(email, twoFactorCode) {
    try {
        const user = await userSchema.findOne({ email: email });

        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        if (twoFactorCode !== user.verificationCode) {
            throw new Error('Código de verificación de doble factor inválido.');
        }

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
    }

    try {
        const user = await userSchema.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            user.loginAttempts += 1;
            await user.save();

            if (user.loginAttempts >= 5) {
                user.isAccountLocked = true;
                await user.save();
                return res.status(401).json({ message: 'La cuenta está bloqueada. Comunícate con el administrador.' });
            }

            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const currentDate = new Date();
        if (user.passwordExpirationDate && currentDate > user.passwordExpirationDate) {
            return res.status(401).json({ message: 'La contraseña ha expirado. Por favor, cambie su contraseña.' });
        }

        const token = jwt.sign({ userId: user._id }, 'secretKey');

        const verificationCode = generateVerificationCode();
        await sendVerificationCodeByEmail(email, verificationCode);

        user.verificationCode = verificationCode;
        await user.save();

        res.json({ success: true, user: user, token: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function changePassword(req, res) {
    const { email, password, verificationCode } = req.body;

    if (!email || !password || !verificationCode) {
        return res.status(400).json({ message: 'El correo electrónico, contraseña y código de verificación son obligatorios.' });
    }

    try {
        const user = await userSchema.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if (verificationCode !== user.verificationCode) {
            return res.status(401).json({ message: 'Código de verificación inválido.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
        user.verificationCode = '';

        await user.save();

        res.json({ success: true, message: 'Contraseña cambiada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function sendVerificationCodePassword(email,verificationCode ) {
    const mailOptions = {
        from: 'kendallmadrigal14@gmail.com',
        to: email,
        subject: 'CroAlquileres - Código de verificación',
        html: `
            <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif; width: 572px; height: 297px; margin: 0 auto; text-align: center;">
            <h2 style="color: #333333;">CroAlquileres</h2>
                <p>Hola,</p>
                <p>Aquí tienes tu código de verificación: <strong>${verificationCode}</strong></p>
                <p>Utiliza este código para cambiar tu contraseña.</p>
                <br>
                <p>Gracias,</p>
                <p>El equipo de CroAlquileres</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error al enviar el correo electrónico');
        } else {
            console.log('Correo electrónico enviado');
        }
    });
}
async function sendMailPassword(req, res, next) {
    const { email } = req.body;
    const verificationCode = generateVerificationCode();
    await sendVerificationCodePassword(email, verificationCode)
    
}
module.exports = {
    validateUserData,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    enableTwoFactor,
    loginUser,
    verifyTwoFactorCode, 
    changePassword, 
    sendMailPassword
};