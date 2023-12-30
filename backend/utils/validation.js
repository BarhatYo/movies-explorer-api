const { celebrate, Joi } = require('celebrate');

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string(), // Поле не обязательное, т.к. можно поменять только Email
    email: Joi.string().email().required().min(2),
    // Поле не обязательное, т.к. можно поменять только имя
  }),
});

const validateAddMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/^https:\/\//).required(),
    trailerLink: Joi.string().pattern(/^https:\/\//).required(),
    thumbNail: Joi.string().pattern(/^https:\/\//).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().pattern(/^[а-яёa-zA-Z0-9\s\W]+$/iu),
    nameEN: Joi.string().required().pattern(/^[а-яёa-zA-Z0-9\s\W]+$/iu),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateUpdateUser,
  validateAddMovie,
  validateDeleteMovie,
};
