# To access the database, copy & paste line below to main .py file:
# from database import db, User, Courses, Enrollment

# Also, make sure to initialize database near the top of the main .py file:
# with app.app_context():
#     db.create_all()

from app import db     # Assuming flask app is named "app" and initialized
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///school.db'
# app.config['SECRET_KEY'] = 'mysecretkey'
# db = SQLAlchemy(app)


# Database for storing users and their passwords and roles
class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False, default='N/A')
    last_name = db.Column(db.String(100), nullable=False, default='N/A')
    middle_name = db.Column(db.String(100), nullable=True, default='')
    # Determines if user is student, teacher, or admin
    role = db.Column(db.String(100), nullable=False)
    # Establishes link between teacher and courses they teach
    courses = db.relationship('Courses', backref='teacher', lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'middle_name': self.middle_name,
            'role': self.role
        }


# Database for storing course name, time, and capacity as well as the associated teacher
class Courses(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    taken = db.Column(db.Integer, nullable=False, default=0)
    capacity = db.Column(db.Integer, nullable=False)
    # Establishes link to enrollments
    students = db.relationship('Enrollment', backref='courses', lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'course_name': self.course_name,
            'teacher_id': self.teacher_id,
            'time': self.time,
            'taken': self.taken,
            'capacity': self.capacity,
        }


# Database for storing which classes the student is enrolled in and their grades for each course
class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    grade = db.Column(db.Integer, nullable=False, default=0)
    student = db.relationship('User', backref='enrollments')
    # course = db.relationship('Courses', backref='enrollments')

    def as_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'grade': self.grade
        }
