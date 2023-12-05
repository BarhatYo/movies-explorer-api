const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Unauthorized = require('../utils/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} невалидный Email`,
    },
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new Unauthorized('Неправильные почта или пароль'));
      }
      return bcrypt.compare(toString(password), user.password)
        .then((matched) => {
          if (!matched) {
            return next(new Unauthorized('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
