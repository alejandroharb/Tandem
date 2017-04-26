$(document).ready(function() {
  let user = document.getElementById('user_name').getAttribute('data-user');
  console.log(user);
  $('.collapsible').collapsible();
  //   firebase.initializeApp(config);
  var database = firebase.database();

  // on window load, userName from window path, golf is initial activity
  // var userName = window.location.pathname.slice(10);
  // console.log("window path username: " + userName);
  var activityModal = "golf";
  var data = [];
  var dataIndex = 3;    // default dataIndex shows score
  var chartTitle = "Score Timeline";
  var chartType = "bar";
  var labelString = ""
  var colorArray = [];
  var sixShades = [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(232, 143, 71, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                    ]
  plotIt();
    //==================Get Activity at Graph Activity Request==================
    // filtering thorugh class getChartData
    $('.getChartData').on('click', function(e) {
        e.preventDefault();
        activityModal = $(this).data("activity").toLowerCase();
        plotIt();
        });

    $('.cummulative').on('click', function(e) {
        e.preventDefault();
        activityModal = $(this).data("activity").toLowerCase();
        dataIndex = 3;
        chartType = "line";
        // chartTitle = "Cummulative Score";
        plotIt();
        });
    //
    $('.dayCreated').on('click', function(e) {
        e.preventDefault();
        activityModal = $(this).data("activity").toLowerCase();
        // chartTitle = "Score Timeline";
        chartType = "bar";
        dataIndex = 2;
        plotIt();
        });

  //get UserActivity Data
  var usersActivityRef = database.ref('userActivity/');
  usersActivityRef.on('child_added', function(response) {
        var newActivity = response.val().userActivity;
        // console.log(newActivity)
        var image = response.val().image;
        var newLi = $('<li>');
        newLi.attr('class', "collection-item avatar");
        //Image
        var newImg = $('<img>')
        newImg.attr('src', '/uploads/images/' + image)
        newImg.attr('class', 'circle responsive-img');
        var newP = $('<p>');
        newP.html(newActivity);
        newLi.append(newImg);
        newLi.append(newP);
        $('#userActivityInsert').prepend(newLi);

  })
  // function getUsersActivity() {
  //   $.get('/users-activity', function(response) {
  //     var data = response;
  //     console.log("-------firebase users activities===========")
  //     console.log(data)
  //   })
  // }
  //==================Generate Graph==================

  function plotIt() {
    // clear canvas
    $(".chartDiv").empty();
    $("." + activityModal + 'ChartDiv').append('<canvas class="chartArea" height="350" width="400"></canvas>');
    $('.collapsible').collapsible();
    var url = '/get-data/' + activityModal + '/' + user;
    console.log("this is the URL: " + url);

    // retrieve data and generate graph
    $.get(url, function(response) {
        var data = response;

        // color cycling for bars
        var dataPoints = data[0].length;
        var cycleIndex = 1;
        var countIndex = 0;
        for (var i=0; i<dataPoints; i++) {
            colorArray.push(sixShades[Math.abs(countIndex)]);
            countIndex += cycleIndex;
            // console.log("countIndex: " + countIndex);
            if (Math.abs(countIndex) >= 5) { cycleIndex *= -1}
        }

        // display total score
        $("." + activityModal + "TotalScore").empty();
        if (activityModal == "Golf") {
          $("." + activityModal + "TotalScore").text(data[3][dataPoints-1]);
        } else {
          $("." + activityModal + "TotalScore").text(data[3][dataPoints-1]);
        }

        // axis labels selection according to activity
        if (activityModal == "Golf") {
          labelString = "Score";
          chartType = "bar";
          dataIndex = 2;
          lineColor = "rgba(75,192,192,1)";
        } else {
          labelString = "Practice Hours";
          lineColor = "rgba(75,192,192,0.3)";
        }

        dataDisplay = data[dataIndex];

        var ctx = $(".chartArea");
        var bars_config = {
            type: chartType,
            data: {
                labels: data[4],
                datasets: [
                  {
                    label: data[1],
                    data: dataDisplay,
                    lineTension: 0.4,
                    fill: true,
                    fillColor: "rgba(151,187,205,0.2)",
                    backgroundColor: "rgba(75,192,192,0.4)",
                    backgroundColor: colorArray,
                    borderColor: lineColor,                // line color
                    pointBorderColor: "rgba(200,192,225,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointRadius: 2,
                    borderWidth: 1
                  }
                ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              // title: {
              //   display: true,
              //   text: chartTitle,
              //   fontSize: 16,
              // },
              scales: {
                yAxes: [{
                  ticks: {
                        beginAtZero:true
                    },
                  scaleLabel: {
                    display: true,
                    labelString: labelString
                  }
                }],
                xAxes: [{
                  ticks: {
                        beginAtZero:true
                    },
                  scaleLabel: {
                    display: true,
                    labelString: 'date'
                  }
                }]
              }
            }
        } // end bars config

        // Chart.defaults.global.defaultFontFamily = ;
        Chart.defaults.global.defaultFontFamily = "Comic Sans MS";
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.responsiveAnimationDuration = 1000;
        Chart.defaults.global.defaultFontColor = "rgba(54,167,255,0.7";
        Chart.defaults.global.defaultFontSize = 14;
        var myChart = new Chart(ctx, bars_config);
        $( ".chartarea" ).fadeIn( 3000 );
      });
    } // end plotIt

});
