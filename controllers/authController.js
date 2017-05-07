const router = require('express').Router();
const express = require('express');
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require('./../config/fbServiceAccountConfig.js');
const craftsController = require('./craftController');
// const firebase = require('./../config/firebaseConfig.js');
const Models = require('../models');
const geocoder = require('geocoder');
//==passport auth==
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const LocalStrategy = require('passport-local').Strategy;

const helpers = require('handlebars-helpers')();

//initialize firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tandem-f181c.firebaseio.com"
});



const authController = {

  createProfile: (req, res) => {
    var data = req.body;
    console.log("creating profile");
    console.log(data);
    Models.User.findOrCreate({
      where: {
        user_name: data.user
      },
      defaults: {
        email: data.email,
        password: data.password,
        first_name: data.first,
        last_name: data.last,
        user_name: data.username,
        address: data.address,
        image: "blank-person.png",
        description: data.description
      }
    }).spread(function (user, created) {
      //check to see if it exists already
      //redirect user to main page
      if (created) {
        console.log("user data created!")
        console.log(user)
        //send success status, and user's entered info
        req.session.uid = user.dataValues.user_name; //setting session to user's name
        res.send(user.dataValues.user_name);
      } else {
        console.log("Error in user data entering!");
        res.send(null);
      }
    });
  },

  setSession: (req, res) => {
    console.log("user id for setting session")
    console.log(req.body.uid);
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

  authenticateUser: (req, res) => {
    var userData = {};//temporarily here for testing
    console.log("I should get the session id here ", req.session.uid);
    // if (req.session.uid === req.params.id) { //security: checking session match
    //   console.log("user has been authenticated");
    //   var userData = {};
    //   //----query data for this specific profile-----
    //   Models.User.findOne({
    //       where: {
    //         user_name: req.params.id
    //       },
    //         include: [Models.Craft] //include all user's crafts
    //     })
    //     .then(function (dbUser) {
    //       //fetching activity data
    //       craftsController.fetchGoalActivity(dbUser.dataValues.address, function(activityData) {
    //         userData.basicInfo = dbUser.dataValues;
    //         userData.activity = activityData;
    //         res.render('user-home', {
    //           info: userData
    //         });
    //       });
    //     });
    // } else {
    //   // res.render("unauthorized", {
    //   //   title: "Unauthorized Access Page",
    //   //   layout: "front-page"
    //   // });
    //   res.redirect('/');
    // }
    Models.User.findOne({
          where: {
            user_name: req.params.id
          },
            include: [Models.Craft] //include all user's crafts
        })
        .then(function (dbUser) {
          //fetching activity data
          craftsController.fetchGoalActivity(dbUser.dataValues.address, function(activityData) {
            userData.basicInfo = dbUser.dataValues;
            userData.activity = activityData;
            res.render('user-home', {
              info: userData
            });
          });
        });

  },

  login: (req, res) => {
    Models.User.findOne({
      where: { user_name: req.body.username, password: req.body.password }
    }).then( (dbUser) => {
      // console.log(dbUser);
      if (dbUser) {
        req.session.uid = dbUser.dataValues.user_name; //setting session to user's name
        res.send(dbUser.dataValues.user_name);
      } else {
        res.send(null);
      }
    });
  },

  saveAvatar: (req, res) => {
    console.log("user: " + req.body.user);
    console.log("img: " + req.body.image);
    Models.User.update({
      image: req.body.image
    },{
      where: {user_name: req.body.user}
    }).then( () => {
      res.send(true);
    })
  }
}

module.exports = authController;
