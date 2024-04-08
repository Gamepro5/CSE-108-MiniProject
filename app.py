from flask import Flask, render_template, redirect, url_for, flash, request, jsonify
from flask_sqlalchemy import SQLAlchemy # Handled in database.py
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required

app = Flask(__name__, template_folder='.')  # Changed template folder to main folder
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///school.db' # Handled in database.py
# app.config['SECRET_KEY'] = 'mysecretkey'
# db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Placed here in order to avoid circular imports
from database import db, User, Courses, Enrollment

# Also initializing here so that database doesn't complain
with app.app_context():
    db.create_all()

# Models
# class User(UserMixin, db.Model): # Handled in database.py
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     password = db.Column(db.String(120), nullable=False)
#     role = db.Column(db.String(120), nullable=False)  # student, teacher, admin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            login_user(user)
            # Redirect to a different page after login based on user role
            if user.role == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('home'))
        else:
            flash('Invalid username or password.')
    return render_template('index.html')    # Changed to index.html for now. Is login.html intended?

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# Placeholder route for the home page
@app.route('/')
def home():
    return "Welcome to the Home Page"

# Placeholder route for the admin dashboard
@app.route('/admin')
@login_required
def admin_dashboard():
    return "Welcome to the Admin Dashboard"

### Routes below will be used to interact with a database. ###
### They all return a json by default                      ###
### Return functions may be changed if needed.             ###


# Adds a user to the database (assuming the input is a json)
@app.route('/add_user', methods=['POST'])
def add_user():
    username = request.json['username']
    password = request.json['password']
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    middle_name = request.json.get('middle_name', '')
    role = request.json['role']

    new_user = User(username=username, password=password, first_name=first_name, last_name=last_name, middle_name=middle_name, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User added successfully.', 'id': new_user.id}), 201


# Display all students in a course given a course id
@app.route('/course/<int:course_id>/students', methods=['GET'])
def display_course_students(course_id):
    course = Courses.query.get(course_id)

    if not course:
        return jsonify({'error': 'This course does not exist.'}), 404

    if course.taken == 0:
        return jsonify({'error': 'No students are in that course.'}), 404

    enrollments = Enrollment.query.filter_by(course_id=course_id).all()

    students = []
    for enrollment in enrollments:
        student = User.query.get(enrollment.student_id)
        if student:  # Check if student exists to avoid referencing None
            student_info = {
                'id': student.id,
                'student_name': student.username,
                'grade': enrollment.grade
            }
            students.append(student_info)

    # The order will be different than shown above. This should not affect anything.
    return jsonify(students)


# Display the courses taught by a teacher given their username (assuming user is a teacher)
@app.route('/teacher/<username>/courses', methods=['GET'])
def display_teacher_courses(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found.'}), 404

    if user.role != 'teacher':
        return jsonify({'error': 'This user is not a teacher.'}), 403

    teacher_courses = Courses.query.filter_by(teacher_id=user.id).all()
    if not teacher_courses:
        return jsonify({'error': 'Teacher does not have any courses.'}), 404

    teacher_full_name = user.first_name + " " + (
        (user.middle_name + " ") if user.middle_name else '') + user.last_name

    all_courses = [{'id': course.id,
                    'name': course.course_name,
                    'teacher_full_name': teacher_full_name,
                    'time': course.time,
                    'total_seats': course.capacity,
                    'taken_seats': course.taken}
                   for course in teacher_courses]

    return jsonify(all_courses)


# Display all courses stored in the database
@app.route('/course/all', methods=['GET'])
def display_all_courses():
    courses = Courses.query.all()
    if not courses:
        return jsonify({'error': 'No course exists.'}), 404

    all_courses = []
    for course in courses:
        user = User.query.get(course.teacher_id)
        if not user:
            return jsonify({'error': 'No teacher exists.'}), 404
        teacher_full_name = user.first_name + " " + (
            (user.middle_name + " ") if user.middle_name else '') + user.last_name
        course_info = {'id': course.id,
                       'name': course.course_name,
                       'teacher_full_name': teacher_full_name,
                       'time': course.time,
                       'total_seats': course.capacity,
                       'taken_seats': course.taken
                       }

        all_courses.append(course_info)

    return jsonify(all_courses)


# Adds or removes a student to a course given a student and course id as well as operation in json format
@app.route('/enroll', methods=['POST'])
def enrollment():
    student_id = request.json['student_id']
    course_id = request.json['course_id']
    operation = request.json.get('operation', 'none')

    if operation != 'add' and operation != 'remove':
        return jsonify({'error': 'Operation unknown.'}), 400

    user = User.query.get(student_id)
    if not user or user.role != 'student':
        return jsonify({'error': 'User does not exist, or user is not a student and cannot be enrolled.'}), 404

    course = Courses.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course does not exist. Please create a course.'}), 404

    existing_enrollment = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()

    if operation == 'add':
        if course.taken >= course.capacity:
            return jsonify({'error': 'Course is at full capacity. Try adding another course.'}), 400

        if existing_enrollment:
            return jsonify({'error': 'Student is already enrolled in this course. Try adding another course.'}), 400

        new_user = Enrollment(student_id=student_id, course_id=course_id)
        db.session.add(new_user)
        course.taken = min(course.taken + 1, course.capacity)   # Ensures that seats does not exceed capacity
        db.session.commit()

        return jsonify({'message': 'User enrolled successfully.', 'id': new_user.id}), 201

    if operation == 'remove':
        if not existing_enrollment:
            return jsonify({'error': 'Student is not enrolled in this course.'}), 404

        db.session.delete(existing_enrollment)
        course.taken = max(course.taken - 1, 0)     # Ensures that seats does not fall below 0
        db.session.commit()

        return jsonify({'message': 'User unenrolled successfully.'}), 201

    # # below used for testing
    # enrollment = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()
    # print(enrollment.student.username)
    # print(course.course_name)
    # print(enrollment.grade)

    return jsonify({'error': 'An unknown error has occurred.'}), 400

# Display all courses, with enrolled being true if a student is enrolled in that class given a student id
@app.route('/course/<int:student_id>', methods=['GET'])
def display_student_enrolled_courses(student_id):
    student = User.query.get(student_id)
    if not student or student.role != 'student':
        return jsonify({'error': 'Student not found or not a student'}), 404

    courses = Courses.query.all()

    if not courses:
        return jsonify({'error': 'Course does not exist. Please create a course.'}), 404

    all_courses = []
    for course in courses:
        is_enrolled = Enrollment.query.filter_by(student_id=student_id, course_id=course.id).first() is not None
        if course:
            teacher = User.query.get(course.teacher_id)
            teacher_full_name = teacher.first_name + " " + (
                (teacher.middle_name + " ") if teacher.middle_name else '') + teacher.last_name
            course_info = {'id': course.id,
                           'name': course.course_name,
                           'teacher_full_name': teacher_full_name,
                           'time': course.time,
                           'total_seats': course.capacity,
                           'taken_seats': course.taken,
                           'is_enrolled': is_enrolled
                           }

            all_courses.append(course_info)

    return jsonify(all_courses)


# Updates a student's grade to a course given a student and course id as well as a new grade in json format
@app.route('/update_grade', methods=['PUT'])
def update_grade():
    student_id = request.json['student_id']
    course_id = request.json['course_id']
    new_grade = request.json['grade']

    if not all([student_id, course_id, new_grade]):
        return jsonify({'error': 'At least one field is empty. Please check if all fields are filled.'}), 400

    student = User.query.get(student_id)
    if not student or student.role != 'student':
        return jsonify({'error': 'User does not exist, or user is not a student'}), 404

    course = Courses.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course does not exist. Please create a course.'}), 404

    enrollment = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()
    if not enrollment:
        return jsonify({'error': 'Student is not enrolled in this course.'}), 400

    if enrollment.grade == new_grade:
        return jsonify({'error': 'Input grade is identical to current grade, no change is done.'}), 400

    enrollment.grade = new_grade
    db.session.commit()

    student_full_name = student.first_name + " " + (
                (student.middle_name + " ") if student.middle_name else '') + student.last_name

    return jsonify({'message': f'Grade updated to {new_grade} for student {student_full_name} in course {course.course_name}.'}), 200


if __name__ == '__main__':
    # with app.app_context():
    #     db.create_all()
    app.run(debug=True)
