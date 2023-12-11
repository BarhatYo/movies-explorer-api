require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./utils/NotFound');
const rateLimiter = require('./utils/rateLimiter');
const errorHandler = require('./utils/errorHandler');

const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:/27017/bitfilmsdb' } = process.env;

app.use(cors());

app.use(express.json());
app.use(helmet());

app.use(rateLimiter);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB', error));

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(2),
    password: Joi.string().required().min(2),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(2),
    password: Joi.string().required().min(2),
  }),
}), login);

app.use(auth);

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  const error = new NotFound('Страница не найдена');
  next(error);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App server listen ${PORT}`);
});
