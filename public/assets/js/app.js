$(document).ready(function () {
    //initialize modal
    $('.modal').modal();
    // Initialize collapse button
    $(".button-collapse").sideNav();

    $('#updateProfileModal').on('click', function () {
        $('#updateProfile').modal('open');
    })
    // =============== USER Set Craft===================
    $('#showCrafts').on('click', function () {
        $('#setCraftModal').modal('open');
    });
});
