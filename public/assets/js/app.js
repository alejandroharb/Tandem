$(document).ready(function () {
    //initialize modal
    $('.modal').modal();
    // Initialize collapse button
    $(".button-collapse").sideNav();
    //initialize date picker
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 5 // Creates a dropdown of 15 years to control year
    });
    $('#updateProfileModal').on('click', function () {
        $('#updateProfile').modal('open');
    })
    // =============== USER Set Craft===================
    $('#showCrafts').on('click', function () {
        $('#setCraftModal').modal('open');
    });
    //on load, display first craft available
    $('.craft-0').click();

});
