from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///school.db'
app.config['SECRET_KEY'] = 'mysecretkey'
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(120), nullable=False)  # student, teacher, admin

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
    return render_template('login.html')

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
