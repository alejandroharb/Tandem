$(document).ready(function () {
    //globally initializing user's username
    let user = document.getElementById('user_name').getAttribute('data-user');
    // initialize materialize collapsible
    $('.collapsible').collapsible();
    //initialize firebase database
    var database = firebase.database();

    //on load, graph data
    graphData();
});