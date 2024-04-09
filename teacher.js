var teacherId = 0;

document.getElementById('back_arrow').onclick = () => {
    document.getElementById('course_name_header').innerHTML = `<div>My Courses</div>`
    document.getElementById('back_arrow').style.display = "none";
    loadAllCourses()
}

function createClassTable(obj) {
        let table = document.getElementById('resultTable');
        table.innerHTML = ``;
        var keys = Object.keys(obj[0]);
        var row = table.insertRow();
        row.insertCell().textContent = "Name";
        row.insertCell().textContent = "Teacher";
        row.insertCell().textContent = "Time";
        row.insertCell().textContent = "Students Enrolled";
        
        for (var i=0;i<obj.length;i++) {
            var row = table.insertRow();
                var cell = row.insertCell();
                cell.innerHTML = `<a class="link">`+obj[i]['name']+`</a>`;
                cell.id = String(obj[i]['id'])
                cell.children[0].setAttribute("onclick", "HTTPRequest_openClass(this.parentElement.id, this.textContent)");
                row.insertCell().textContent = obj[i]['teacher_full_name'];
                row.insertCell().textContent = obj[i]['time'];
                row.insertCell().textContent = obj[i]['taken_seats']+'/'+obj[i]['total_seats'];
        }

}

function HTTPRequest_loadAllCourses(teacher_id) {
    /*  INPUTS: teacher ID global variable (teacherId)
        OUTPUTS: ARRAY OF JSONS of all the classes taught by that teacher


        [{ "id": 1, "name": "CSE 155", "teacher_full_name": "Ammon Hepworth", "time" : "MWF 2:00-2:50 PM", "total_seats": 10, "taken_seats": 5}, ...]
    
        Call loadAllCourses(data); when data is in the format mentioned above.
    */

    fetch(`http://localhost:5000/teacher/${teacher_id}/courses`)
    .then(response => response.json())
    .then(data => {
        console.log(data)   // 'data' should be an array of jsons with courses a teacher teaches

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
            loadAllCourses(data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function loadAllCourses(data) {
    var courses = document.getElementById('teachers_course_list');
    document.getElementById('selected_course').style.display = "none";
    courses.style.display = "block";

    

    courses.innerHTML = `<table id='resultTable'></table>`;
    createClassTable(data)
}

function HTTPRequest_openClass(course_id) {
    /*  INPUTS: course_id
        OUTPUTS: ARRAY OF JSONS of all the students enrolled in a class.


        [{ "id": 1, "student_name": "Julien", "grade": 12},{ "id": 2, "student_name": "Haris", "grade": 34}]
    
        Call openClass(data, courseName, course_id); when data is in the format mentioned above.
    */

    var courseName = ""

    fetch(`http://localhost:5000/course/${course_id}/students`)
    .then(response => response.json())
    .then(data => {
        console.log(data)   // 'data' should be an array of jsons with all students in a course

        // From there, use the json from 'data' for your purposes
        // And remember to use response.status to handle errors

        for (let i = 0; i < data.length; i++){
            const course_data = data[i]

            // These logs print each course detail for reference.
            console.log(course_data.id)
            console.log(course_data.student_name)
            console.log(course_data.grade)
        }

         fetch(`http://localhost:5000/course/${course_id}/get_name`)
            .then(response => response.json())
            .then(details => {
                courseName = details.course_name
            })
            .catch(error => {
            console.error('Error fetching details:', error);
            });

        openClass(data, courseName, course_id);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    fetch
}

function openClass(studentList, courseName, courseId) {
    var courses = document.getElementById('teachers_course_list');
    var course = document.getElementById('selected_course')
    courses.style.display = "none";
    course.style.display = "block";
    document.getElementById('course_name_header').innerHTML = `<div>`+courseName+`</div>`
    document.getElementById('back_arrow').style.display = "block";
    courses.innerHTML = ``;
    course.innerHTML = `<table id='resultTable'></table>`;


    create_studentList_table(studentList, courseId)
}
 

function editGrade(student_id, course_id, grade) {
    /*  
        INPUTS: student_id, course_id, grade
        OUTPUTS: nothing

        This should edit a grade of a student in a specific course.
    */

    fetch(`http://localhost:5000/update_grade`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: student_id,
            course_id: course_id,
            grade: grade,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // 'data' is a json message stating if operation is successful or not

        // Remember to use response.status to handle errors and print message from 'data'
    })
}

loadAllCourses()

function teacherOpenCourse() {
document.getElementById('back_arrow').style.display = "inline";
}


function create_studentList_table(obj, courseId) {
    let table = document.getElementById('resultTable');
    table.innerHTML = ``;
    var keys = Object.keys(obj[0]);
    var row = table.insertRow();
    var cell = row.insertCell().textContent = "Name";
    row.insertCell().textContent = "Grade";
    for (var i=0;i<obj.length;i++) {
        var row = table.insertRow();
        
        row.insertCell().textContent = obj[i]['student_name'];
        var cell = row.insertCell()
        cell.innerHTML = `<input style="width: 50px;" type='number' value='`+obj[i]['grade']+`'>`;
        cell.id =  String(obj[i]['id']);
        cell.children[0].addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                console.log(document.activeElement)
                var me = document.activeElement;
                editGrade(me.parentElement.id, courseId, me.value)
            }
        })
    }
}