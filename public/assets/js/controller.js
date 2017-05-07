//global reference to user's username
let user = document.getElementById('user_name').getAttribute('data-user');
var database = firebase.database();

//opens modal for respective craft
let display_Craft_Add_Modal = (craft) => {
    //clear element children before appending
    let modalNode = document.getElementById('addCraftModals');
    while (modalNode.firstChild) {
        modalNode.removeChild(modalNode.firstChild)
    }
    //Send AJAX request for modal html (via handlebars partial)
    let id = '#setCraft_' + craft;
    $.ajax({
        method: "GET",
        url: '/api/crafts/addCraft/' + craft + '/' + user
    }).then((response) => {

        $('#addCraftModals').append(response);
        //initialize modal
        $('.modal').modal();
    }).then(() => {
        //open modal
        $(id).modal('open');
    });

}

let handle_Add_Craft_Submit = (e) => {
    e.preventDefault();
    //collect data
    
    let years = parseInt($('#YearsExperience').val());
    let rating = parseInt($('input[name="rating"]:checked').val());
    let craft = $('#craft').val();
    let clientPostData = {
        year_experience: years,
        experience_rating: rating
    }
    let url = '/api/home/choices/' + craft + '/' + user;
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
var polarChart;
let graphPolarChart = async () => {
  if(polarChart) {
    polarChart.destroy();
  }
  let ctx = $('#craftsPolarChart');
  var graphDataArr = [];
  var craftArr = [];
  //get data
  let userScoreData = await getChartData(user);
  for (package of userScoreData) {
    //separate into craft array and hours array
    craftArr.push(package.craft);
    let sum = package.scores.reduce( (cumm, curr) => { return cumm + parseInt(curr);});
    graphDataArr.push(sum);
  }
  //generate polar pie chart
  polarChart = new Chart(ctx, {
      data: {
        labels: craftArr,
        datasets: [{
          data:graphDataArr,
          backgroundColor:["#FF6384","#4BC0C0"]
        }]
      },
      type: 'polarArea',
      options: {
          title: {
              display: true,
              text: 'Your Craft Focus'
          },
          legend: {
            display:true,
            position:'left',
            fullWidth:false,
            labels:{
              fontSize:8,
              boxWidth:8
            }
          }
      }
  });
}

Chart.defaults.global.hover = 'point';
// gets score data, and graphs for all crafts
let graphData = async () => {
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
                    type:'line',
                    label: 'Hours Logged',
                    data: package.scores,
                    yAxisID: "y-axis-bar",
                    backgroundColor: 'rgba(127, 129, 129, 0.26)',
                    borderColor: '#7f8181',
                    borderWidth: 1,
                    fill:false
                  },
                  {
                    type:'line',
                    label: 'Accumulated Hours',
                    data: package.scoresCumm,
                    yAxisID: "y-axis-cummulative",
                    backgroundColor: 'rgba(96, 125, 139, 0.76)',
                    borderColor: '#607d8b',
                    borderWidth: 1,
                    fill:true
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

let saveGoalScore = (craft, data) => {
  $.ajax({
    method: 'PUT',
    url: '/api/crafts/goal-score-update/' + craft + '/' + user,
    data: data
  }).then( (res) => {
    displayStats(craft);
  })
}

let saveScores = async (craft) => {
  let hours = $('#hours'+ craft).val();
  let database = firebase.database();
  let date = moment().format(); //moment.js used for formatting the time
  //firebase store data
  database.ref('Scores/Users/' + user + '/' + craft + '/' + date).set({
    hours: hours
  })

  let data = {hours: hours, date: date};
  await saveGoalScore(craft, data);
  //signal user, data saved successfully (materialize UI)
  Materialize.toast("Saved", 3000, 'themeToast');
  //graph the data
  await clearCanvas(craft);
  graphData();
  graphPolarChart();
};

let create_Score_Modal = (craft) => {
  //clear element children before appending
  let modalNode = document.getElementById('scoreModals');
  while (modalNode.firstChild) {
      modalNode.removeChild(modalNode.firstChild)
  };
  let id = "#" + craft + "ScoreModal";
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
let calculateTimeDiff = (goalDate) => {
  let currentTime = moment();
  let timeDiff = moment(goalDate).diff(currentTime, 'hours');
  if(goalDate == null){
    return "No Goal";
  } else if(parseInt(timeDiff) > 24) {
    let days = Math.round(timeDiff / 24);
    return days + " Days";
  } else {
    return timeDiff + " Hours";
  }
};

let displayStats = (craft) => {
  //=== display: line chart===
  $('#'+craft+'Collapsible').click(); //open collapsible
  //get data
  $.ajax({
    method:'GET',
    url: '/api/crafts/craft-stuff/' + craft + '/' + user
  }).then((craftData) => {
    //get craft data
    //===goal hours display===
    let timeDifference = calculateTimeDiff(craftData.goal_date);
    $('#craftGoalDeadline').empty().append('<p>' + timeDifference + '</p>');
    //===donut pie chart===
    var ctx = $('#craftGoal');
    let hoursToDo = craftData.goal_hours_set - craftData.goal_hours_accomplished;
    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Done", "To Do"],
          datasets: [{
            data: [craftData.goal_hours_accomplished, hoursToDo],
            backgroundColor: [
                "rgba(127, 129, 129, 0.26)",
                "rgba(96, 125, 139, 0.76)"
            ],
          }]
        },
        options: {
            title: {
                display: true,
                text: 'Goal Progress'
            },
            legend: {
              fullWidth:false,
              position: 'left',
              labels:{
                fontSize:8,
                boxWidth:8
              }
            }
        }
    });
  })
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
    method: 'PUT',
    url: '/api/crafts/set-goal/' + craft + '/' + user,
    data:data
  }).then( () => {
    Materialize.toast("Saved", 3000, 'themeToast');
    displayStats(craft);
  });
}

// ==== after user chooses avatar -> route to home page ===
function handleAvatarHomeUpload(img) {
  console.log(img);
  console.log(user);
  let data = {
    image: img,
    user: user
  }
  $.ajax({
    method: 'PUT',
    url: '/api/auth/avatar',
    data: data
  }).then( (res) => {
    if(res) {
      console.log(res);
      location.reload();
    } else {
      alert("error in saving avatar");
    }
  })
}
