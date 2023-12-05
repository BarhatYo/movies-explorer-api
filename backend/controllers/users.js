const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { CREATED, SUCCESS } = require('../constants/statusCodes');

const BadRequest = require('../utils/BadRequest');
const Conflict = require('../utils/ConflictError');
const NotFound = require('../utils/NotFound');

const getProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      res.send(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      );
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(toString(password), 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(CREATED).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(userId, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные в метод обновления профиля'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(SUCCESS).send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getProfile,
  updateUser,
};
