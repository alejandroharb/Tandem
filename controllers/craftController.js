'use strict';

const Models = require('../models');
const router = require('express').Router();
const helpers = require('./helpers');
const distance = require('google-distance');
const scoreConstroller = require('./scoreController');
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
        helpers.findCity(data, address, (city) => {
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
        console.log("----address----");
        console.log(response.dataValues.address);
        //function uses geocoder to convert user's address into a city
        helpers.findCity(clientPostData, response.dataValues.address, (city) => {
          //--- database save craft----
          Models.Craft.create({
            UserId: response.dataValues.id,
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
      goal_hours:req.body.hours,
      goal_date:req.body.date
    },{
      where: {
        user_name: req.params.user,
        craft: req.params.craft
      }
    }).then( (dbCraft) => {
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
  }
}

module.exports = craftsController;
