const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please provide a name'],
        maxlength: [50, 'Name must not be more than 50 characters']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please provide an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['customer', 'staff', 'admin'],
        default: 'customer'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpireDateTime: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership',
        required: true
    }
});

// Hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Create `updatedAt` field
userSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    name: Joi.string().trim().max(50),
    email: Joi.string().trim().email(),
    role: Joi.string().valid('customer', 'staff', 'admin'),
    password: Joi.string().min(6)
};

function validateOnCreateUser(user) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.email = tmpValidationSchema.email.required();
    tmpValidationSchema.role = tmpValidationSchema.role.required();
    tmpValidationSchema.password = tmpValidationSchema.password.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(user);
}

function validateOnUpdateUser(user) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.membershipId = Joi.objectId();
    delete tmpValidationSchema.password;
    delete tmpValidationSchema.role;

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(user);
}

exports.User = mongoose.model('User', userSchema);
exports.validateOnCreateUser = validateOnCreateUser;
exports.validateOnUpdateUser = validateOnUpdateUser;
