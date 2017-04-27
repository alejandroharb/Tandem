'use strict';

const router = require('express').Router();
const craftsController = require('./../controllers/craftController.js');
const scoreController = require('./../controllers/scoreController.js');

router.get('/crafts/:user', (req, res) => {
  let craftArr = craftsController.fetchScores(req, res);
  // console.log(craftArr)
  // craftArr.then(scoreController.fetchScores(craftArr, req.params.user, res))
  
});

router.get('/scoreModal/:craft/:user', (req, res) => {
  scoreController.fetchScoreModal(req, res);
});

module.exports = router;
