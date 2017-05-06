'use strict';
const geocoder = require('geocoder');

const helper = {
  findCity: (clientPostData, loc, cb) => {
      geocoder.geocode(loc, function (err, data) {
          let locData = data.results[0].address_components;
          for (var i = 0; i < locData.length; i++) {
              if (locData[i].types[0] === "locality") {
                  let city = locData[i].long_name; //desired city, passed to cb() variable
                  cb(city)
                  break;
              }
          }
      });
  },
  //constructor builds goal update to send to client
  GoalPackage: function (goalAccomplished, goalExpired, totalGoals, totalGoalsAccomplished) {
    this.goalAccomplished = goalAccomplished;
    this.goalExpired = goalExpired;
    this.totalGoals = totalGoals;
    this.totalGoalsAccomplished = totalGoalsAccomplished;
  }
}

module.exports = helper;
