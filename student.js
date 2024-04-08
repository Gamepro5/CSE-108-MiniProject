
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