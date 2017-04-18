'use strict';

const admin = require("firebase-admin");
const firebase = require('./../config/firebaseConfig.js');
const Model = require('../models');
const geocoder = require('geocoder');

const authController = {
  firebaseCreateUser: (req, res) => {
    const data = req.body;
    admin.auth().createUser({
        uid: data.username,
        email: data.email,
        emailVerified: false,
        password: data.password,
        disabled: false
      })
      .then((userRecord) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        res.send(error)
      })
  },

  createProfile: (req, res) => {
    var data = req.body;
    //---!!!refactor this code!!!---
    var city = geocoder.geocode(data.address, function(err, data) {
      var locData = data.results[0].address_components;
      for (var i = 0; i < locData.length; i++) {
        if (locData[i].types[0] === "locality") {
          return locData[i].long_name;
        }
      }
    });
    Models.User.findOrCreate({
      where: {
        user_name: data.username
      },
      defaults: {
        first_name: data.first,
        last_name: data.last,
        user_name: data.username,
        address: data.address,
        city: city, //from function above
        image: "blank-person.png",
        description: data.description
      }
    }).spread(function(user, created) {
      //check to see if it exists already
      //redirect user to main page
      // console.log("created: " + created);
      if (created) {
        console.log("user data created!")
        console.log(created)
        //send success status, and user's entered info
        res.status(200).send(created);
      } else {
        console.log("Error in user data entering!");
        res.status(400).send("Oops! Well this is embarassing. We've encountered an error in data process. Come back soon, as we're liking working on fixing this.");
      }
    });
  },

  setSession: (req, res) => {
    req.session.uid = req.body.uid;
    console.log("Setting session uid ", req.session.uid);
    res.end();
  },

  signOutUser: (req, res) => {
    console.log("destroying session for signing out")
    req.session.destroy(function (err) {
        console.log(err)
        res.end();
    });
  },

  logInUser: (req, res) => {
    console.log("I should get the session id here ", req.session.uid);
    if (req.session.uid === req.params.id) { //security: checking session match
        console.log("user has been authenticated");
        //---adding image source for displaying----
        var userData = {};
        //----query data for this specific profile-----
        Model.User.findOne({ where: { user_name: req.params.id } })
            .then(function (response) {
                userData.basicInfo = response.dataValues;
                res.render('user-home', { info: userData });
            })
    } else {
        res.render("unauthorized", {title:"Unauthorized Access Page", layout: "front-page"});
    }
  }
}

module.exports = authController;
