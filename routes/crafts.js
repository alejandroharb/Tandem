'use strict';

const router = require('express').Router();
const craftsController = require('./../controllers/craftController.js');

//================= get user crafts ===================
router.get('/match/options/:user', (req, res) => {
  craftsController.fetchCraftMatchOptions(req,res);
});
//==========USER MATCHING==========
router.get('/match/:craft/:user', (req, res) => {
  craftsController.fetchUserMatches(req, res);
});

router.get('/addCraft/:craft/:username', (req, res) => {
  craftsController.fetchModal(req, res);
});

router.get('/goalModal/:craft/:user', (req, res) => {
  craftsController.fetchGoalModal(req, res);
});

router.post('/set-goal/:craft/:user', (req, res) => {
  craftsController.setCraftGoal(req,res);
});
module.exports = router;
