// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDgkyYAcN295X18NrK4SNx4GudA1DxsDlo",
    authDomain: "tandem-f181c.firebaseapp.com",
    databaseURL: "https://tandem-f181c.firebaseio.com",
    projectId: "tandem-f181c",
    storageBucket: "tandem-f181c.appspot.com",
    messagingSenderId: "824292856341"
  };
  firebase.initializeApp(config);

  var provider = new firebase.auth.GoogleAuthProvider();
