//global reference to user's username
let user = document.getElementById('user_name').getAttribute('data-user');

//opens modal for respective craft
let display_Craft_Add_Modal = (craft, username) => {
    //clear element children before appending
    let modalNode = document.getElementById('addCraftModals');
    while (modalNode.firstChild) {
        modalNode.removeChild(modalNode.firstChild)
    }
    //Send AJAX request for modal html (via handlebars partial)
    let id = '#setCraft_' + craft;
    $.ajax({
        method: "GET",
        url: '/api/crafts/addCraft/' + craft + '/' + username
    }).then((response) => {
        console.log(response);
        $('#addCraftModals').append(response);
        //initialize modal
        $('.modal').modal();
    }).then(() => {
        //open modal
        console.log(id)
        $(id).modal('open');
    });

}

let handle_Add_Craft_Submit = (e) => {
    e.preventDefault();
    //collect data
    let username = $('#username').val();
    let years = parseInt($('#YearsExperience').val());
    let rating = parseInt($('input[name="rating"]:checked').val());
    let craft = $('#craft').val();
    let clientPostData = {
        year_experience: years,
        experience_rating: rating
    }
    let url = '/api/home/choices/' + craft + '/' + username;
    //AJAX POST
    $.post(url, clientPostData, function (response) {
        Materialize.toast("Saved", 3000);
    });
}

let createChart = (context, configs) => {
    return new Chart(context, configs)
}

let getChartData = (user) => {

  $.ajax({
    method: 'GET',
    url: '/api/scores/crafts/' + user
  }).then((craftArr) => {

  })
}

let saveScores = () => {
  let craft = $('#craft').val();
  let hours = $('#hours'+ craft).val();
  let database = firebase.database();
  let date = new Date();
  //firebase store data
  database.ref('Scores/Users/' + user + '/' + craft + '/' + date).set({
    hours: hours
  });
  //signal user, data saved successfully (materialize UI)
  Materialize.toast("Saved", 3000);
};

let create_Score_Modal = (craft) => {
  //clear element children before appending
  let modalNode = document.getElementById('scoreModals');
  while (modalNode.firstChild) {
      modalNode.removeChild(modalNode.firstChild)
  };
  let id = "#" + craft + "ScoreModal";
  console.log(id);
  $.ajax({
      method: "GET",
      url: '/api/scores/scoreModal/' + craft + '/' + user
  }).then((response) => {
    $('#scoreModals').append(response);
    //initialize modal
    $('.modal').modal();
  }).then( () => {
    $(id).modal('open');
  });
};
