const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const user = require('../controllers/user')
const { storeReturnTo } = require('../middleware');

router
  .route('/register')
  .get(user.registerForm)
  .post(storeReturnTo, catchAsync(user.registerUser))

router
  .route('/login')
  .get(user.loginForm)
  .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.loginUser)

router.get('/logout', user.logoutUser)

module.exports = router;