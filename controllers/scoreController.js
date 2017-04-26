'use strict'

const Models = require('../models');

let scoreController = {
  fetchScores: (craftsArr, user) => {
    //fetch data from firebase from each craft
    // query database
    craftsArr.forEach( (elem, index) => {
      let scoreArrays = [[]]
      let craft = elem;
      var ref = database.ref("Scores/Users/" + user + "/" + craft);

      ref.once('value').then(function (snapshot) {
        var dataArray = snapshot.val();
        console.log(dataArray);
      });

    })
  },

  fetchScoreModal: (req, res) => {
    res.render("partials/scoreModalPartial", {
      score: {user: req.params.user, craft:req.params.craft },
      layout: false
    });
  }
}

module.exports = scoreController;
