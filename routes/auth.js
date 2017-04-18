'use strict';

const router = require('express').Router();
const authController = require('../controllers/authController.js');

//==========creating new user account==========
router.post('/sign-up', (req, res) => {
  authController.firebaseCreateUser(req,res);
});

//==========setting profile info (after creating account)==========
router.post('/new-profile', (req,res) => {
  authController.createProfile(req,res);
});

//============set/destroy USER session===========
router.post('user/authenticate', (req, res) => {
  authController.setSession(req,res);
});
router.get('user/authenticate/signout', (req, res) => {
  authController.signOutUser(req, res);
});

//=============Route User Home + Authenticate credentials with Session==============
router.post('home/:id', (req, res) => {
  authController.logInUser(req, res);
});

module.exports = router;
