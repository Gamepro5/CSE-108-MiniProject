document.getElementById('back_arrow').onclick = () => {
    document.getElementById('course_name_header').innerHTML = `<div>My Courses</div>`
    document.getElementById('back_arrow').style.display = "none";
}


function teacherOpenCourse() {
document.getElementById('back_arrow').style.display = "inline";
}