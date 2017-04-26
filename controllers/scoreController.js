'use strict'

const Models = require('../models');

let scoreController = {
  fetchScores: (craftsArr) => {
    //fetch data from firebase from each craft
    // query database
    var ref = database.ref("Scores/Users/" + username + "/" + craft);
  }
}

module.exports = scoreController;
