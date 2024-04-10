document.getElementById('login_button').onclick = () => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    /*  INPUTS: username, password
        OUTPUTS: the type of account ("teacher" or "student"), and the id.


        Call redirect(type, username, id); when the outputs are met.
    */

    fetch(`http://localhost:5000/login`, {  // This route seems to redirect instead of returning anything
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data)
        fetch(`http://localhost:5000/get_user/${username}`)
            .then(response => response.json())
            .then(details => {
                console.log(details)
                var type = details.role
                var id = details.id
                redirect(type, username, id);
            })
    })
    .catch(error => console.error('Error:', error));

}

function redirect(type, username, id) {
    if (type == "teacher") {
        window.location.replace("localhost:5000/teacher?name=" + username + "&id=" + id);
    } else if (type == "student") {
        window.location.replace("localhost:5000/student?name=" + username + "&id=" + id);
    } else {
        alert("Error: Invalid account type.")
    }
}