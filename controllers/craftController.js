'use strict';

const Models = require('../models');
const router = require('express').Router();
const helpers = require('./helpers');
const distance = require('google-distance');
const scoreConstroller = require('./scoreController');
const moment = require('moment');
let firebase = require('./../config/firebaseConfig.js');

let database = firebase.database();



const craftsController = {
  fetchCraftMatchOptions: (req, res) => {
    Models.User.findOne({
        where: {
          user_name: req.params.user
        },
        include: [Models.Craft]
      })
      .then((dbUser) => {
        res.render("partials/craftMatchPartial", {
          crafts: dbUser.dataValues.Crafts,
          layout: false
        });
      });
  },

  fetchUserMatches: (req, res) => { //!!!!!needs refactored!!!!!!!
    Models.User.findOne({
        where: {
          user_name: req.params.user
        }
      })
      .then(function (data) {
        var address = data.dataValues.address
        //use geocode function with callback to find city synchronously
        helpers.findCity(null, address, (city) => {
          Models.Craft.findAll({
              where: [{
                city: city
              }, {
                craft: req.params.craft
              }],
              include: [Models.User]
            })
            .then((dbCraft) => {
              var distanceArray = [];
              var userAddress = {
                userHome: address
              }
              distanceArray.push(userAddress)

              var i = 0;
              gatherDistData(i);

              function completeMatch(array) {
                var userRating;
                for (var i = 1; i < array.length; i++) {
                  if (array[i].username === req.params.user) {
                    userRating = array[i].rating;
                    break;
                  }
                }
                var filteredArr = array.filter(function (obj, index) {
                  if (index === 0) {
                    return true;
                  }
                  if (obj.username === req.params.user || obj.rating !== userRating) {
                    return false;
                  } else {
                    return true
                  };
                })
                res.json(filteredArr)
              }

              function gatherDistData(index) {
                // console.log("startPoint: " + startPoint)
                var destination = dbCraft[index].dataValues.User.address;
                var username = dbCraft[index].dataValues.user_name;
                var name = dbCraft[index].dataValues.User.first_name + " " + dbCraft[index].dataValues.User.last_name;
                var rating = dbCraft[index].dataValues.experience_rating;
                var origin = address;
                var yearsExperience = dbCraft[index].dataValues.year_experience;
                var userImgPath = dbCraft[index].dataValues.User.image;

                var userDistanceData = {
                  username: username,
                  user: name,
                  years: yearsExperience,
                  rating: rating,
                  userImg: userImgPath,
                }
                //------------google npm : gets distance between two locations------------
                distance.get({
                    origin: origin,
                    destination: destination,
                    mode: "driving",
                    metric: "imperial"
                  },
                  (err, data) => {
                    if (err) throw err;

                    //converting distance from feet into miles
                    let dist = data.distanceValue * 0.000189394;
                    //adding distance as key in object to be send
                    //maintaining distance to 2 decimal places
                    userDistanceData.distance = dist.toFixed(2);
                    distanceArray.push(userDistanceData);

                    index++;
                    if (index < dbCraft.length) {
                      gatherDistData(index)
                    } else {
                      distanceArray.sort(function (a, b) {
                        return a.distance - b.distance;
                      })
                      completeMatch(distanceArray)
                    }
                  }
                );
              }
            });
        });
      });
  },

  addCraft: (req, res) => {
    let clientPostData = req.body;
    console.log('----client post data----');
    console.log(clientPostData);
    Models.User
      .findOne({
        where: {
          user_name: req.params.user
        }
      })
      .then((response) => {
        console.log("----first_name----");
        console.log(response.dataValues.first_name);
        //function uses geocoder to convert user's address into a city
        helpers.findCity(clientPostData, response.dataValues.address, (city) => {
          //--- database save craft----
          Models.Craft.create({
            UserId: response.dataValues.id,
            first_name: response.dataValues.first_name,
            user_name: req.params.user,
            craft: req.params.craft,
            year_experience: clientPostData.year_experience,
            experience_rating: clientPostData.experience_rating,
            city: city,
            total_goals:0,
            goals_accomplished: 0
          }).then(function (data) {
            res.json(data); // send saved data back to front-end
          });
        })
      })
  },

  fetchModal: (req, res) => {
    let userCraftData = {
      craft: req.params.craft,
      username: req.params.username
    }
    console.log(userCraftData);
    res.render("partials/addCraftModalPartial", {
      userData: userCraftData,
      layout: false
    });
  },

  fetchGoalModal: (req, res) => {
    let userCraftData = {
      craft: req.params.craft,
      username: req.params.user
    }
    res.render("partials/goalModalPartial", {
      userData: userCraftData,
      layout: false
    });
  },

  setCraftGoal: (req, res) => {
    Models.Craft.update({
      goal_hours_set:req.body.hours,
      goal_date:req.body.date,
      goal_set:true
    },{
      where: {
        user_name: req.params.user,
        craft: req.params.craft
      }
    }).then( (dbCraft) => {
      console.log(dbCraft)
      res.end();
    })
  },

  fetchScores: (req, res) => {
    let craftArr = [];
    // Models.User.findOne({
    //     where: {
    //       user_name: req.params.user
    //     },
    //     include: [Models.Craft]
    //   })
    //   .then((dbUser) => {
    //     dbUser.dataValues.Crafts.forEach((elem, index) => {
    //       craftArr.push(elem.craft);
    //     });
    //     console.log(craftArr);

    //     let scoreArrays = [];
    //     for (let craft in craftsArr) {
    //       var ref = database.ref("Scores/Users/" + user + "/" + craft);

    //       ref.once('value').then(function (snapshot) {
    //         var dataArray = snapshot.val();
    //         console.log(dataArray);
    //         let scorePkg = new ScoreDataPackage(craft, dataArray);
    //         scoreArrays.push(scorePkg);
    //         console.log(scoreArrays);
    //       });

    //     };
    //     res.send(scoreArrays);
    //   });
    // let user = req.params.user;
    // var ref = database.ref("Scores/Users/" + user);
    // ref.once('value').then(function (snapshot) {
    //     res.send("snapshot");
    // });
  },

  fetchCraftStuff: (req, res, user, craft, cb) => {
    var username, userCraft;
    if(req) {
      username = req.params.user;
      userCraft = req.params.craft;
    }
    if(user && craft) {
      username = user;
      userCraft = craft;
    }
    Models.Craft.findOne({
      where: {
        user_name: username,
        craft: userCraft
      }
    }).then( (dbCraft) => {
      if(req) {
        res.send(dbCraft);
      }
      if(user && craft) {
        cb(dbCraft);
      }
    })
  },

  updateCraftGoal: (req, res) => {
    let user = req.params.user;
    let craft = req.params.craft;
    Models.Craft.findOne({
      where: {
        user_name: user,
        craft: craft
      },
      include: [Models.User]
    }).then( (dbCraft) => {
      console.log("==========right here Mayne=========")
      console.log(dbCraft.dataValues);
      //if a goal is set, update with latest scores
      let hourInput = parseInt(req.body.hours);
      let updatedGoalHours = parseInt(dbCraft.goal_hours_accomplished) + hourInput;
      let totalGoals = parseInt(dbCraft.total_goals);
      let goalsAccomplished = parseInt(dbCraft.goals_accomplished);
      console.log("goal date: " + dbCraft.goal_date);
      console.log("date at time of hour submit: " + req.body.date)
      let dateDifference = moment(dbCraft.goal_date).diff(req.body.date); //date difference calculated
      console.log("date difference => " + dateDifference);
      if(dbCraft.goal_set) {
        console.log("goal is set")
        //if goal achieved && time not expired, update database and inform client
        if(dbCraft.goal_hours_set <= updatedGoalHours && dateDifference > 0) { // - [ ] also need to add condition on date
          console.log("---------goal achieved!!---------")
          totalGoals ++ //update goals set
          goalsAccomplished ++ //update goals accomplished
          craftsController.addActivity(dbCraft.dataValues); //========adding to Activity Table========
          Models.Craft.update({
            goal_set: false,
            goal_hours_set: 0,
            goal_hours_accomplished: 0,
            goal_date:null,
            total_goals:totalGoals,
            goals_accomplished: goalsAccomplished
          },{
            where: {
              user_name: user,
              craft: craft
            }
          }).then( () => {
            //build response package
            let responsePackage = new helpers.GoalPackage(true, false, dbCraft.total_goals, dbCraft.goals_accomplished);
            res.send(responsePackage);
          })

        }
        //if goal not accomplished, and goal not expired
        if(dbCraft.goal_hours_set > updatedGoalHours && dateDifference > 0) {
          console.log("goal NOT achieved and NOT expired!!")
          Models.Craft.update({
            goal_hours_accomplished: updatedGoalHours
          },{
            where: {
              user_name:user,
              craft: craft
            }
          }).then( () => {
            craftsController.fetchCraftStuff(null, null, user, craft, function(data) {
              console.log(data);
              //build response package
              let responsePackage = new helpers.GoalPackage(false, false, data.total_goals, data.goals_accomplished);
              //inform client
              res.send(responsePackage);
            });


          })
        }
        //if goal not accomplished && goal has expired
        if(dbCraft.goal_hours_set > updatedGoalHours && dateDifference < 0){
          totalGoals ++ //update goals set
          Models.Craft.update({
            goal_set: false,
            goal_hours_set: 0,
            goal_hours_accomplished: 0,
            goal_date:null,
            total_goals:totalGoals
          },{
            where: {
              user_name: req.params.user,
              craft: craft
            }
          }).then( (dbCraft) => {
            //build response package
            let responsePackage = new helpers.GoalPackage(false, true, dbCraft.total_goals, dbCraft.goals_accomplished);
            //inform client
            res.send(responsePackage);
          });
        }
      }
    });
  },

  fetchGoalActivity: (address, cb) => {
    //use geocode function with callback to find city synchronously
    return helpers.findCity(null, address, (city) => {
      console.log("===========in fetchGoalActivity function: city => " + city);
      Models.Activity.findAll({
          where: { city: city}
        })
        .then((dbActivity) => {
           cb(dbActivity.reverse());
        });
    });
  },

  addActivity: (data) => {
    let date = moment();
    Models.Activity.create({
      first_name: data.User.first_name,
      user_name: data.User.user_name,
      image: data.User.image,
      craft: data.craft,
      city: data.city,
      hours_accomplished: data.goal_hours_set,
      date: date
    })
    .then( () => {

    })
  }
}

module.exports = craftsController;
