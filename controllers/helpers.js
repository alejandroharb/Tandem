'use strict';
const geocoder = require('geocoder');

const helper = {
  findCity: (clientPostData, loc, cb) => {
      geocoder.geocode(loc, function (err, data) {
          console.log(data.results[0].address_components)
          let city = data.results[0].address_components.forEach( (elem, i)=>{
            if (elem.types[0] == 'locality'){
              //call callback function with city
              return cb(elem.long_name);
            }
          });
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
