'use strict';

const router = require('express').Router();
const craftsController = require('./../controllers/craftController.js');

//================= get user crafts ===================
router.get('/match/options/:user', (req, res) => {
  craftsController.fetchMatchOptions(req,res);
});
//==========USER MATCHING==========
router.get('/match/:craft/:user', (req, res) => {
  craftsController.fetchUserMatches(req, res);
});

router.get('/addCraft/:craft/:user', (req, res) => {
  craftsController.fetchAddCraftModal(req, res);
});

router.get('/craft-options/:user', (req, res) => {
  craftsController.fetchCraftAddOptionsModal(req, res);
});

router.get('/goalModal/:craft/:user', (req, res) => {
  craftsController.fetchGoalModal(req, res);
});

router.put('/set-goal/:craft/:user', (req, res) => {
  craftsController.setCraftGoal(req,res);
});

router.get('/craft-stuff/:craft/:user', (req, res) => {
  craftsController.fetchCraftStuff(req, res);
});

router.put('/goal-score-update/:craft/:user', (req, res) => {
  craftsController.updateCraftGoal(req, res);
})
module.exports = router;
