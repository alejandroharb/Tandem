'use strict';

const router = require('express').Router();
const craftsController = require('./../controllers/craftController.js');
const scoreController = require('./../controllers/scoreController.js');

router.get('/crafts/:user', (req, res) => {
  let craftArr = craftsController.fetchUserCrafts(req, res);
  scoreController.fetchScores(craftArr, req.params.user);
});

router.get('/scoreModal/:craft/:user', (req, res) => {
  scoreController.fetchScoreModal(req, res);
});

module.exports = router;
