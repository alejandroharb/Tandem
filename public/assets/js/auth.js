var userNameGlobal;
$(document).ready(function () {
    //initialize modal
    $('.modal').modal();
    //================Loggin in==================
    $('#logInBtn').on('click', function (e) {
        e.preventDefault();

        //collect variables
        var user = $('#user').val().trim();
        var password = $('#password').val().trim();
        let data = {username: user, password:password}
        $.ajax({
          method: 'POST',
          url: '/api/auth/login',
          data
        }).then((data, message, xhr) => {
            if(!data){
              alert("username of password are incorrect");
            }
            if(data) {
              window.location.href = '/api/auth/home/' + data;
            }
        });
    });
    //============Creating new User==============
    $('#newProfileSubmit').on('click', function (event) {
        event.preventDefault();
        var username = $('#userName').val().trim();
        var password = $('#password').val().trim();
        var email = $('#email').val().trim();
        var firstName = $('#first_name').val().trim();
        var lastName = $('#last_name').val().trim();
        var userName = $('#userName').val().trim();
        var address = $('#address').val().trim();
        var description = $('#description').val().trim();
        var data = {
            user: username,
            password: password,
            email: email,
            first: firstName,
            last: lastName,
            username: userName,
            address: address,
            description: description
        };

        $.ajax({
            method: "POST",
            url: '/api/auth/new-profile',
            data,
        }).then( (data, message, xhr) => {
            if(data){
              userNameGlobal = data;
              console.log(userNameGlobal);
              $('#avatarModal').modal('open');
              //window.location.href = '/api/auth/home/' + data;
            }
            if(!data) {
              alert("Oops! An error occurred, try again!");
              setTimeout(() => {
                window.location.href = '/create-user';
              },3000);
            }
        });
    });


    $('#unauthLoginRedirect').on('click', function () {
        window.location.href = '/';
    })
    $('#unauthSignUpRedirect').on('click', function () {
        window.location.href = '/create-user';
    })
    $('#googleSignIn').on('click', (e) => {
      e.preventDefault();
      googleSignIn();
    })
    $('#userSignOut').on('click', function() {
        // userSignOut();
        window.location.href = '/';
    });
    //---if user uploads image -> route to home page---
    $('#imageUploadSubmit').on('click', function() {
      window.location.href = '/api/auth/home/' + userName;
    })
});


// function googleSignIn() {
//     console.log("inside this google signin func!")
//     //firebase popup google sign in functio
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       var token = result.credential.accessToken;
//       // The signed-in user info.
//       var user = result.user;
//       console.log(result.user);
//     }).catch(function(error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // The email of the user's account used.
//       var email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       var credential = error.credential;
//       // ...
//     });
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             console.log(user.uid);
//             // User is signed in.
//             var url = '/api/auth/user/authenticate';
//             $.ajax({
//                 method: 'POST',
//                 url: url,
//                 data: {
//                     uid: user.uid
//                 }
//             }).then(function (response) {
//                 window.location.href = '/api/auth/home/' + user.uid;
//
//             });
//         };
//     });
//
// };
//
// function userSignOut() {
//     firebase.auth().signOut().then(function () {
//         // Sign-out successful.
//         console.log("user signed out!")
//     }).catch(function (error) {
//         // An error happened.
//         console.log(error);
//     });
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (!user) {
//             // User is not signed in.
//             var url = './../user/authenticate/signout';
//             $.ajax({
//                 method: 'GET',
//                 url: url,
//             }).then(function (response) {
//                 window.location.href = '/';
//             });
//         } else {
//             console.log("user still signed in")
//             console.log(user)
//         }
//     });
// }

// ==== after user chooses avatar -> route to home page ===
function handleAvatarUpload(img) {
  console.log(img);
  console.log(userNameGlobal);
  let data = {
    image: img,
    user: userNameGlobal
  }
  $.ajax({
    method: 'PUT',
    url: '/api/auth/avatar',
    data: data
  }).then( (res) => {
    if(res) {
      console.log(res);
      window.location.href = '/api/auth/home/' + userNameGlobal;
    } else {
      alert("error in saving avatar");
    }
  })
}
