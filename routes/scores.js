'use strict';

const router = require('express').Router();
const craftsController = require('./../controllers/craftController.js');

router.get('/crafts/:user', (req, res) => {
  craftsController.fetchUserCrafts(req, res);
});

module.exports = router;
