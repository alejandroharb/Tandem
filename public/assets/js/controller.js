//global reference to user's username
let user = document.getElementById('user_name').getAttribute('data-user');
  var database = firebase.database();
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

//constructor
function ScoreDataPackage (craft, dateArr, scoreArr) {
  this.craft = craft;
  this.dates = dateArr;
  this.scores = scoreArr;
}

let getChartData = async (user) => {
    let dataArr = [];
    var ref = database.ref("Scores/Users/" + user);
    return ref.once('value').then(function (snapshot) {
        let data = snapshot.val();
        for(var craft in data) {
            let dateArr = [];
            let scoreArr = [];
            for(var date in data[craft]){
                dateArr.push(moment(date).format('MMM D, YY'));
                let dateObj = data[craft][date];
                scoreArr.push(dateObj.hours);
            };
            let scorePkg = new ScoreDataPackage(craft, dateArr, scoreArr);
            dataArr.push(scorePkg);
        }
        return dataArr;
    });

}

// gets score data, and graphs for all crafts
let graphData = async() => {
    let userScoreData = await getChartData(user);
    for (package of userScoreData) {
        let classStr = "." + package.craft + "Chart"
        var ctx = $(classStr);
        let chart = {
            type: 'bar',
            data: {
                labels: package.dates,
                datasets: [{
                    label: 'Hours Logged',
                    data: package.scores,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        };
        $(classStr).empty();
        let thisChart = new Chart(ctx, chart);
    }
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
  //graph the data
  graphData()
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
