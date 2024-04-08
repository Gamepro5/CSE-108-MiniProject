var userMode = "TEACHER"

if (userMode == "STUDENT") {
    document.getElementById('my_courses_button').onclick = () => {
        document.getElementById('my_courses_button').classList.add('pressed')
        document.getElementById('add_courses_button').classList.remove('pressed')
        document.getElementById('my_courses').style.display = "block";
        document.getElementById('add_courses').style.display = "none";
    }
    document.getElementById('add_courses_button').onclick = () => {
        document.getElementById('my_courses_button').classList.remove('pressed')
        document.getElementById('add_courses_button').classList.add('pressed')
        document.getElementById('my_courses').style.display = "none";
        document.getElementById('add_courses').style.display = "block";
    }
} else if (userMode == "TEACHER") {
    document.getElementById('back_arrow').onclick = () => {
        document.getElementById('course_name_header').innerHTML = `<div>My Courses</div>`
        document.getElementById('back_arrow').style.display = "none";
    }
}


function teacherOpenCourse() {
    document.getElementById('back_arrow').style.display = "inline";
}