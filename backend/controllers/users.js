const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { CREATED, SUCCESS } = require('../constants/statusCodes');
const {
  USER_NOT_FOUND_MESSAGE,
  USER_CONFLICT_MESSAGE,
  USER_BAD_REQUEST_MESSAGE,
} = require('../constants/errorMessages');

const BadRequest = require('../utils/BadRequest');
const Conflict = require('../utils/ConflictError');
const NotFound = require('../utils/NotFound');

const getProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound(USER_NOT_FOUND_MESSAGE);
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

  bcrypt.hash(password, 10)
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
        return next(new Conflict(USER_CONFLICT_MESSAGE));
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
        return next(new BadRequest(USER_BAD_REQUEST_MESSAGE));
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
