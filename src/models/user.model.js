const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    passwordHistory: [{ type: String }],
    isTwoFactorEnabled: { type: Boolean, default: false },
    verificationCode: { type: String },
    isAccountLocked: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    passwordExpirationDate: { type: Date },
    provincia: { type: String, required: true },
    canton: { type: String, required: true },
    distrito: { type: String, required: true }
});

userSchema.methods.setPasswordExpiration = function(days) {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    this.passwordExpirationDate = expirationDate;
};

module.exports = mongoose.model('User', userSchema);