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

function HTTPRequest_loadAllCourses() {
    /*  INPUTS: teacher ID global variable (teacherId)
        OUTPUTS: ARRAY OF JSONS of all the classes taught by that teacher


        [{ "id": 1, "name": "CSE 155", "teacher_full_name": "Ammon Hepworth", "time" : "MWF 2:00-2:50 PM", "total_seats": 10, "taken_seats": 5}, ...]
    
        Call loadAllCourses(data); when data is in the format mentioned above.
    */
}

function loadAllCourses(data) {
    var courses = document.getElementById('teachers_course_list');
    document.getElementById('selected_course').style.display = "none";
    courses.style.display = "block";

    

    courses.innerHTML = `<table id='resultTable'></table>`;
    createClassTable(data)
}

function HTTPRequest_openClass(course_id, courseName) {
    /*  INPUTS: course_id
        OUTPUTS: ARRAY OF JSONS of all the students enrolled in a class.


        [{ "id": 1, "student_name": "Julien", "grade": 12},{ "id": 2, "student_name": "Haris", "grade": 34}]
    
        Call openClass(data, courseName, course_id); when data is in the format mentioned above.
    */
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