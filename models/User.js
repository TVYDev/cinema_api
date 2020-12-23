const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const ROLE_CUSTOMER = 'customer';
const ROLE_STAFF = 'staff';

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
    enum: [ROLE_CUSTOMER, ROLE_STAFF],
    default: 'customer'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
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
    ref: 'Membership'
  }
});

userSchema.methods.generateJwtToken = function () {
  const privateKey = process.env.JWT_PRIVATE_KEY;
  const expiresIn = parseInt(process.env.JWT_EXPIRES_IN_SECONDS);
  const token = jwt.sign({ id: this._id, role: this.role }, privateKey, {
    expiresIn
  });
  return token;
};

// Remove `password` field from toJSON() function
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

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

// Compare hashed password
userSchema.methods.compareHashedPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const validationSchema = {
  name: Joi.string().trim().max(50),
  email: Joi.string().trim().email(),
  role: Joi.string().valid(ROLE_CUSTOMER, ROLE_STAFF),
  password: Joi.string().min(6),
  membershipId: Joi.objectId()
};

function validateOnCreateUser(user) {
  const tmpValidationSchema = { ...validationSchema };
  tmpValidationSchema.name = tmpValidationSchema.name.required();
  tmpValidationSchema.email = tmpValidationSchema.email.required();
  tmpValidationSchema.role = tmpValidationSchema.role.required();
  tmpValidationSchema.password = tmpValidationSchema.password.required();
  tmpValidationSchema.membershipId = tmpValidationSchema.membershipId.when(
    'role',
    { is: ROLE_CUSTOMER, then: Joi.required(), otherwise: Joi.forbidden() }
  );

  const schema = Joi.object(tmpValidationSchema);

  return schema.validate(user);
}

function validateOnUpdateUser(user) {
  const tmpValidationSchema = { ...validationSchema };
  delete tmpValidationSchema.password;

  const schema = Joi.object(tmpValidationSchema);

  return schema.validate(user);
}

function validateOnRegisterUser(user) {
  const tmpValidationSchema = { ...validationSchema };
  tmpValidationSchema.name = tmpValidationSchema.name.required();
  tmpValidationSchema.email = tmpValidationSchema.email.required();
  tmpValidationSchema.password = tmpValidationSchema.password.required();
  delete tmpValidationSchema.role;
  delete tmpValidationSchema.membershipId;

  const schema = Joi.object(tmpValidationSchema);

  return schema.validate(user);
}

function validateOnLoginUser(user) {
  const tmpValidationSchema = { ...validationSchema };
  tmpValidationSchema.email = tmpValidationSchema.email.required();
  tmpValidationSchema.password = Joi.string().required();
  delete tmpValidationSchema.name;
  delete tmpValidationSchema.role;
  delete tmpValidationSchema.membershipId;

  const schema = Joi.object(tmpValidationSchema);

  return schema.validate(user);
}

exports.User = mongoose.model('User', userSchema);
exports.ROLE_CUSTOMER = ROLE_CUSTOMER;
exports.ROLE_STAFF = ROLE_STAFF;
exports.validateOnCreateUser = validateOnCreateUser;
exports.validateOnUpdateUser = validateOnUpdateUser;
exports.validateOnRegisterUser = validateOnRegisterUser;
exports.validateOnLoginUser = validateOnLoginUser;
