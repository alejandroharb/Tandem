'use strict';

const Models = require('../models');
const router = require('express').Router();
const helpers = require('./helpers');
const distance = require('google-distance');

const craftsController = {
  fetchUserCrafts: (req, res) => {
    Models.User.findOne({
        where: {
          user_name: req.params.user
        },
        include: [Models.Craft]
      })
      .then((dbUser) => {
        res.render("partials/craftMatchPartial", {
          crafts: dbUser.Crafts,
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
      .then(function(data) {
        var address = data.dataValues.address
        //use geocode function with callback to find city synchronously
        helpers.findCity(address, () => {
          Models.Craft.findAll({
              where: [{
                city: city
              }, {
                craft: req.params.craft
              }],
              include: [Models.User]
            })
            .then((dbCraft) => {
              console.log("==================data result==================")
              console.log(dbCraft.dataValues)
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
                  if (array[i].username === username) {
                    userRating = array[i].rating;
                    break;
                  }
                }
                var filteredArr = array.filter(function(obj, index) {
                  if (index === 0) {
                    return true;
                  }
                  if (obj.username === username || obj.rating !== userRating) {
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
                    dist = data.distanceValue * 0.000189394;
                    //adding distance as key in object to be send
                    //maintaining distance to 2 decimal places
                    userDistanceData.distance = dist.toFixed(2);
                    distanceArray.push(userDistanceData);

                    index++;
                    if (index < dbCraft.length) {
                      gatherDistData(index)
                    } else {
                      distanceArray.sort(function(a, b) {
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
  }
}

module.exports = craftsController;
