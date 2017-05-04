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
        Materialize.toast("Saved", 3000, 'themeToast');
        setTimeout( () => {
          location.reload();
        }, 1000);
    });
}

//constructor
function ScoreDataPackage (craft, dateArr, scoreArr, scoreCummArr) {
  this.craft = craft;
  this.dates = dateArr;
  this.scores = scoreArr;
  this.scoresCumm = scoreCummArr;
}

let getChartData = async (user) => {
    let dataArr = [];
    var ref = database.ref("Scores/Users/" + user);
    return ref.once('value').then(function (snapshot) {
        let data = snapshot.val();
        for(var craft in data) {
            let dateArr = [];
            let scoreArr = [0];
            let scoreCummArr = [0];
            for(var date in data[craft]){
                dateArr.push(moment(date).format('MMM D, YY'));
                //populate date array
                let dateObj = data[craft][date];
                //populate score array
                scoreArr.push(dateObj.hours);
                //populate cummulative array
                if(scoreCummArr.length){
                    scoreCummArr.push(parseInt(dateObj.hours) + scoreCummArr[scoreCummArr.length - 1]);
                } else {
                  scoreCummArr.push(parseInt(dateObj.hours));
                }
            };

            let scorePkg = new ScoreDataPackage(craft, dateArr, scoreArr, scoreCummArr);
            dataArr.push(scorePkg);
        }
        return dataArr;
    });

}
let clearCanvas = (id) => {
  let newCanvas = $('<canvas>').addClass('.' + id + 'Chart').attr('height', '300').attr('width', '580');
  $('.chartDiv').empty().append(newCanvas)
}

Chart.defaults.global.hover = 'point';
// gets score data, and graphs for all crafts
let graphData = async() => {
    let userScoreData = await getChartData(user);
    for (package of userScoreData) {
        //using jquery to get child canvas of specific craft collapsible
        var ctx = $("." + package.craft + "ChartDiv > canvas")
        let chart = {
            type: 'bar',
            data: {
                labels: package.dates,
                datasets: [
                  {
                    type:'bar',
                    label: 'Hours Logged',
                    data: package.scores,
                    yAxisID: "y-axis-bar",
                    backgroundColor: 'rgba(127, 129, 129, 0.26)',
                    borderColor: '#7f8181',
                    borderWidth: 1
                  },
                  {
                    type:'line',
                    label: 'Accumulated Hours',
                    data: package.scoresCumm,
                    yAxisID: "y-axis-cummulative",
                    backgroundColor: 'rgba(96, 125, 139, 0.76)',
                    borderColor: '#607d8b',
                    borderWidth: 1
                  }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                    {
                      position: "left",
                      "id": "y-axis-bar"
                    }, {
                      position: "right",
                      "id": "y-axis-cummulative"
                    }
                  ]
                }
            }
        };
        let thisChart = new Chart(ctx, chart);
    }
}

let saveScores = async(craft) => {
  let hours = $('#hours'+ craft).val();
  let database = firebase.database();
  let date = moment().format(); //moment.js used for formatting the time
  //firebase store data
  await database.ref('Scores/Users/' + user + '/' + craft + '/' + date).set({
    hours: hours
  })
  //signal user, data saved successfully (materialize UI)
  Materialize.toast("Saved", 3000, 'themeToast');
  //graph the data
  await clearCanvas(craft);
  graphData();
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

let displayStats = (craft) => {

};
let create_Goal_Modal = (craft) => {
  //clear element children before appending
  let modalNode = document.getElementById('goalModal');
  while (modalNode.firstChild) {
      modalNode.removeChild(modalNode.firstChild)
  };
  let id = "#goalModal_" + craft;
  $.ajax({
    method: 'GET',
    url: '/api/crafts/goalModal/' + craft + '/' + user
  }).then( (response) => {
    $('#goalModal').append(response);
    //initialize modal
    $('.modal').modal();
  }).then( () => {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 5 // Creates a dropdown of 15 years to control year
    });
    $(id).modal('open'); //open modal
  });
}

let set_goal = (e) => {
  e.preventDefault();

  let goalDate = moment($('#goalDate').val()).format();
  let goalHours = $('#goalHours').val();
  let craft = $('#craft').val();
  let data = {
    date: goalDate,
    hours: goalHours,
    craft: craft
  }
  $.ajax({
    method: 'POST',
    url: '/api/crafts/set-goal/' + craft + '/' + user,
    data
  }).then( () => {
    Materialize.toast("Saved", 3000, 'themeToast');
  });
}
