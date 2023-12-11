const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
  message: 'Слишком много запросов с этого IP, попробуйте позже.',
});

module.exports = rateLimiter;
