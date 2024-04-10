
var studentId = 0;

const params = new URLSearchParams(window.location.search);
for (const p of params) {
    if (p[0] == "id") {
        studentId = p[1]
    } else if (p[0] == "username") {
        document.getElementById('welcome-text').innerText = "Welcome, " + p[1];
    }
}

document.getElementById('my_courses_button').onclick = () => {
    document.getElementById('my_courses_button').classList.add('pressed')
    document.getElementById('add_courses_button').classList.remove('pressed')
    document.getElementById('my_courses').style.display = "block";
    document.getElementById('add_courses').style.display = "none";
    HTTPRequest_loadMyCourses(studentId);
}
document.getElementById('add_courses_button').onclick = () => {
    document.getElementById('my_courses_button').classList.remove('pressed')
    document.getElementById('add_courses_button').classList.add('pressed')
    document.getElementById('my_courses').style.display = "none";
    document.getElementById('add_courses').style.display = "block";
    HTTPRequest_loadAllCourses(studentId);
}

// Noticed that these functions were missing parameters, which are needed so that information can be collected from the database
function HTTPRequest_loadAllCourses(student_id) {
    /*  INPUTS: student ID global variable (studentId)
        OUTPUTS: ARRAY OF JSONS of all the classes with an added "enrolled" parameter that is true if the student is enrolled.


        [{ "id": 1, "name": "CSE 155", "teacher_full_name": "Ammon Hepworth", "time" : "MWF 2:00-2:50 PM", "total_seats": 10, "taken_seats": 5, "enrolled": true}, ...]
    
        Call loadAllCourses(data); when data is in the format mentioned above.
    */

    fetch(`http://localhost:5000/course/${student_id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)   // 'data' should be an array of jsons with all courses and if student is enrolled in that course

        // From there, use the json from 'data' for your purposes
        // And remember to use response.status to handle errors

        for (let i = 0; i < data.length; i++){
            const course_data = data[i]

            // These logs print each course detail for reference.
            console.log(course_data.id)
            console.log(course_data.name)
            console.log(course_data.teacher_full_name)
            console.log(course_data.time)
            console.log(course_data.total_seats)
            console.log(course_data.taken)
            console.log(course_data.is_enrolled)
        }

        loadAllCourses(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
function HTTPRequest_loadMyCourses(student_id) {
    /*  INPUTS: student ID global variable (studentId)
        OUTPUTS: ARRAY OF JSONS of the classes the student is in.


        [{ "id": 1, "name": "CSE 155", "teacher_full_name": "Ammon Hepworth", "time" : "MWF 2:00-2:50 PM", "total_seats": 10, "taken_seats": 5}, ...]
    
        Call loadMyCourses(data); when data is in the format mentioned above.
    */

    fetch(`http://localhost:5000/student/${student_id}/courses`)
    .then(response => response.json())
    .then(data => {
        console.log(data)   // 'data' should be an array of jsons with only the courses a student is taking

        // From there, use the json from 'data' for your purposes
        // And remember to use response.status to handle errors

        for (let i = 0; i < data.length; i++){
            const course_data = data[i]

            // These logs print each course detail for reference.
            console.log(course_data.id)
            console.log(course_data.name)
            console.log(course_data.teacher_full_name)
            console.log(course_data.time)
            console.log(course_data.total_seats)
            console.log(course_data.taken)
        }

        loadMyCourses(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
HTTPRequest_loadMyCourses(studentId)

function addCourse(student_id, course_id) {
    /*  
        INPUTS: student ID global variable (studentId), course_id, and "operation" set to "add"
        OUTPUTS: nothing

        This should add a course to a student's catalog.
    */

    var operation = "add";

    fetch(`http://localhost:5000/enroll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: student_id,
            course_id: course_id,
            operation: operation,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)   // 'data' is a json message stating if operation is successful or not

        // Remember to use response.status to handle errors and print message from 'data'
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function removeCourse(student_id, course_id) {
    /*  
        INPUTS: student ID global variable (studentId), course_id, and "operation" set to "remove"
        OUTPUTS: nothing

        This should remove a course from a student's catalog.
    */

    var operation = "remove";

    fetch(`http://localhost:5000/enroll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: student_id,
            course_id: course_id,
            operation: operation,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)   // 'data' is a json message stating if operation is successful or not

        // Remember to use response.status to handle errors and print message from 'data'
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function loadMyCourses(obj) {
    
    document.getElementById('add_courses').innerHTML = ``;
    
    document.getElementById('my_courses').innerHTML = `<table id="resultTable"></table>`
    let table = document.getElementById('resultTable');
    table.innerHTML = ``;
    var keys = Object.keys(obj[0]);
    var row = table.insertRow();
    row.insertCell().textContent = "Course Name";
    row.insertCell().textContent = "Teacher";
    row.insertCell().textContent = "Time";
    row.insertCell().textContent = "Students Enrolled";
    
    for (var i=0;i<obj.length;i++) {
        var row = table.insertRow();
            row.insertCell().textContent = obj[i]['name'];
            row.insertCell().textContent = obj[i]['teacher_full_name'];
            row.insertCell().textContent = obj[i]['time'];
            row.insertCell().textContent = obj[i]['taken_seats']+'/'+obj[i]['total_seats'];
    }
}

function loadAllCourses(obj) {
    
    document.getElementById('my_courses').innerHTML = ``;
    
    document.getElementById('add_courses').innerHTML = `<table id="resultTable"></table>`
    let table = document.getElementById('resultTable');
    console.log(table)
    table.innerHTML = ``;
    var keys = Object.keys(obj[0]);
    var row = table.insertRow();
    row.insertCell().textContent = "Course Name";
    row.insertCell().textContent = "Teacher";
    row.insertCell().textContent = "Time";
    row.insertCell().textContent = "Students Enrolled";
    row.insertCell().textContent = "Add/Drop Class";
    
    for (var i=0;i<obj.length;i++) {
        console.log(obj[i]['name']);
        var row = table.insertRow();
            row.insertCell().textContent = obj[i]['name'];
            row.insertCell().textContent = obj[i]['teacher_full_name'];
            row.insertCell().textContent = obj[i]['time'];
            row.insertCell().textContent = obj[i]['taken_seats']+'/'+obj[i]['total_seats'];
            if (obj[i]['enrolled']) {
                var cell = row.insertCell();
                cell.innerHTML = `<button id=` + obj[i]['id'] +` onclick="removeCourse(this.id)">Drop</button>`;
            } else {
                var cell = row.insertCell();
                cell.innerHTML = `<button id=` + obj[i]['id'] +` onclick="addCourse(this.id)">Add</button>`;
            }
    }
}