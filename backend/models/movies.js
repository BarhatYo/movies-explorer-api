const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  director: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  duration: {
    type: Number,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  year: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  description: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  image: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} некорректный URL`,
    },
  },
  trailerLink: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} некорректный URL`,
    },
  },
  thumbNail: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} некорректный URL`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number, // id фильма, который содержится в ответе сервиса MoviesExplorer.
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  nameRU: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  nameEN: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
