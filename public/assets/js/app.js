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
        $('#updateProfileImage').modal('open');
    })
    // =============== USER Set Craft===================
    $('#showCrafts').on('click', function () {
        //clear element children before appending
        let modalNode = document.getElementById('addCraftOptionsModal');
        while (modalNode.firstChild) {
            modalNode.removeChild(modalNode.firstChild)
        }
        //Send AJAX request for modal html (via handlebars partial)
        $.ajax({
            method: "GET",
            url: '/api/crafts/craft-options/' + user
        }).then((response) => {

            $('#addCraftOptionsModal').append(response);
            //initialize modal
            $('.modal').modal();
        }).then(() => {
            //open modal
            $('#setCraftModal').modal('open');
        });
        
    });
    //on load, display first craft available
    $('.craft-0').click();

});