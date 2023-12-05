const router = require('express').Router();
const { validateUpdateUser } = require('../utils/validation');

const {
  getProfile,
  updateUser,
} = require('../controllers/users');

router.get('/me', getProfile);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
