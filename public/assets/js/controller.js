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

let handle_Add_Craft_Submit = () => {
    // e.preventDefault();
    //collect data
    let username = $('#username').val();
    let years = parseInt($('#YearsExperience').val());
    let rating = parseInt($('input[name="rating"]:checked').val());
    let craft = $('#craft').val();
    let clientPostData = {
        year_experience: years,
        experience_rating: rating
    }
    console.log(clientPostData);
    let url = '/api/home/choices/' + craft + '/' + username;
    console.log("ajax url: " + url)
    //AJAX POST
    $.post(url, clientPostData, function (response) {
        console.log("-ajax response from server-")
        console.log(response);
        Materialize.toast("Saved", 3000);
    });
    return false;
}
