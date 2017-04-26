// var admin = require("firebase-admin");
var firebase = require('firebase');

// var serviceAccount = require("./Grow-with-Friends-firebaseServiceAccountKey.json"); //currently with firebase for Grow-with-Friends until migration
// //initialize firebase Admin
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "grow-with-friends.firebaseapp.com"
// });
var config = ({
  apiKey: "AIzaSyDgkyYAcN295X18NrK4SNx4GudA1DxsDlo",
  authDomain: "tandem-f181c.firebaseapp.com",
  databaseURL: "https://tandem-f181c.firebaseio.com",
  projectId: "tandem-f181c",
  storageBucket: "tandem-f181c.appspot.com",
  messagingSenderId: "824292856341"
});

firebase.initializeApp(config);
// module.exports = admin;
module.exports = firebase;
