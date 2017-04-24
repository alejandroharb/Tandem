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
        url: '/api/crafts/addCraft/' + craft
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
    var username = $('#user_name').val()
    var years = $('#YearsExperience').val();
    years = parseInt(years);
    var rating = $('input[name="rating"]:checked').val();
    rating = parseInt(rating);
    console.log("rating value from radio button: " + rating)
    var data = {
        year_experience: years,
        experience_rating: rating
    }
    var url = '/api/home/choices/golf/' + username;
    // console.log(url)
    //AJAX POST
    $.post(url, data, function (response) {
        // console.log(response);
        Materialize.toast("Saved", 3000);
    })
}