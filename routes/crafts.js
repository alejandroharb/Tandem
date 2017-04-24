'use strict';

const router = require('express').Router();
const craftsController = require('./../controllers/craftController.js');

//================= get user crafts ===================
router.get('/match/options/:user', (req, res) => {
  craftsController.fetchUserCrafts(req,res);
});
//==========USER MATCHING==========
router.get('/match/:craft/:user', (req, res) => {
  craftsController.fetchUserMatches(req, res);
});

router.get('/addCraft/:craft', (req, res) => {
  craftsController.fetchModal(req, res);
});

module.exports = router;
