const Movie = require('../models/movies');
const BadRequest = require('../utils/BadRequest');
const NotFound = require('../utils/NotFound');
const Forbidden = require('../utils/Forbidden');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const formattedMovies = movies.map((movie) => ({
        _id: movie._id,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        thumbNail: movie.thumbNail,
        owner: movie.owner,
        movieId: movie.movieId,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
      }));
      res.send(formattedMovies);
    })
    .catch(next);
};

const addMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbNail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    owner,
    year,
    description,
    image,
    trailerLink,
    thumbNail,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(
      {
        _id: movie._id,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        thumbNail: movie.thumbNail,
        owner: movie.owner,
        movieId: movie.movieId,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные в метод добавления карточки'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId).orFail(new NotFound('Фильм не найден'))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new Forbidden('Вы не являетесь владельцем добавленного фильма');
      }
      return Movie.deleteOne({ _id: movieId })
        .then(() => res.send({ message: 'Фильм удален' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

module.exports = {
  addMovie,
  getMovies,
  deleteMovie,
};
