'use strict'

const Models = require('../models');
let firebase = require('./../config/firebaseConfig.js');

let database = firebase.database();

let scoreController = {
  fetchScores:  (craftsArr, user) => {
    //fetch data from firebase from each craft
    // query database
    let scoreArrays = [];
    for (let craft in craftsArr) {
      var ref = database.ref("Scores/Users/" + user + "/" + craft);
      
       ref.once('value').then(function (snapshot) {
        var dataArray = snapshot.val();
        console.log(dataArray);
        let scorePkg = new ScoreDataPackage(craft, dataArray);
        scoreArrays.push(scorePkg);
        console.log(scoreArrays);
      });

    };
    res.send(scoreArrays);
  },

  fetchScoreModal: (req, res) => {
    res.render("partials/scoreModalPartial", {
      score: {user: req.params.user, craft:req.params.craft },
      layout: false
    });
  }
}

module.exports = scoreController;
