
var address = "http://localhost:5000"
var placeholder = [{ "id": 1, "student_name": "Julien", "grade": 12},{ "id": 2, "student_name": "Haris", "grade": 34}]


function create_table(obj) {
    let table = document.getElementById('resultTable');
    table.innerHTML = ``; /*delete table*/
    var header = obj[0];
    var keys = Object.keys(obj[0]);
    var row = table.insertRow();
    for (var i=0;i<keys.length;i++) {
        row.insertCell().textContent = keys[i];
    }
    for (var i=0;i<obj.length;i++) {
        var row = table.insertRow();
        for (var j=0;j<keys.length;j++) {
            row.insertCell().textContent = obj[i][keys[j]];
        }
    }
}