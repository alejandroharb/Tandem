'use strict';
const geocoder = require('geocoder');

const helper = {
  findCity: (clientPostData, loc, cb) => {
      geocoder.geocode(loc, function (err, data) {
          //call callback function with city
          cb(data.results[0].address_components[3].long_name);
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
