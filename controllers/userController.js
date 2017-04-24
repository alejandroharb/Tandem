'use strict';

const router = require('express').Router();
const Models = require('../models');
const helpers = require('./helpers');
const Yelp = require("yelp");

const yelp = new Yelp({
  consumer_key: 'r4398R0p_QsYtAAGGKbtCQ',
  consumer_secret: '42LcpXrFyul5tsnDATsX4d3hKV0',
  token: 'OFSdJ8SDrc1wqoruhiXnKiFDH-iLKOh6',
  token_secret: '3czB4yWh_u3OvJ60kMoC7MkV4Yc',
})

const userController = {
  fetchOptions: (req, res) => {
    console.log(" fetching craft options for => ", req.params.user);
    db.User.findOne({
        where: {
          user_name: req.params.user
        },
        include: [db.Craft]
      })
      .then(function(dbUser) {

        console.log(dbUser);
        res.render("partials/craftUserProgressPartial", {
          crafts: dbUser.Crafts,
          layout: false
        });
      });
  },

  addCraft: (req, res) => {
    Models.User
      .findOne({
        where: {
          user_name: username
        }
      })
      .then((response) => {
        //function uses geocoder to convert user's address into a city
        helpers.findCity(req.body, response.dataValues.address, (city) => {
          //--- database save craft----
          db.Craft.create({
            UserId: response.dataValues.id,
            user_name: req.params.user,
            craft: req.params.craft,
            year_experience: data.year_experience,
            experience_rating: data.experience_rating,
            city: city
          }).then(function(data) {
            res.json(data); // send saved data back to front-end
          });
        })
      })
  },

  yelpSearch: (req, res) => {
    yelp.search({
      term: "golf course",
      location: req.body.address
    }).then( (yelpResponse) => {
      res.json(yelpResponse.businesses);
    }).catch(function(err) {
      console.log(err)
    });
  }
}
