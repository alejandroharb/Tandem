'use strict';
const router = require('express').Router();
const userController = require('../controllers/userController.js');

//============USER SELECTS THEIR SKILLS==============
router.post('/choices/:craft/:user', (req, res) => {
  userController.addCraft(req, res);
});

router.post('/choices/options/:user', (req, res) => {
  userController.fetchOptions(req,res);
});

router.post('/api/yelp', (req, res) => {
  userController.yelpSearch(req, res);
});
module.exports = router;
