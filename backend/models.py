from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

# Initialize the SQLAlchemy instance for database interactions
db = SQLAlchemy()


class User(db.Model):
    """
    User model representing the account system.
    Handles authentication data and links to all personal wellness records.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships: Link the user to their respective health metrics.
    # cascade="all, delete-orphan" ensures metrics are securely deleted if the user account is removed.
    hydration_records = db.relationship('Hydration', backref='user', lazy=True, cascade="all, delete-orphan")
    nutrition_records = db.relationship('Nutrition', backref='user', lazy=True, cascade="all, delete-orphan")
    exercise_records = db.relationship('Exercise', backref='user', lazy=True, cascade="all, delete-orphan")
    journal_records = db.relationship('Journal', backref='user', lazy=True, cascade="all, delete-orphan")


class Hydration(db.Model):
    """
    Hydration model tracking daily water intake.
    Measures the number of glasses consumed per day.
    """
    __tablename__ = 'hydration'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    glasses = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)


class Nutrition(db.Model):
    """
    Nutrition model tracking daily calorie intake.
    Measures total calories consumed per day.
    """
    __tablename__ = 'nutrition'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)


class Exercise(db.Model):
    """
    Exercise model tracking physical activity.
    Records both the type of workout (e.g., Running, Yoga) and its duration in minutes.
    """
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    exercise_type = db.Column(db.String(100), nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)


class Journal(db.Model):
    """
    Journal model for free-form wellness tracking.
    Allows users to log custom notes, moods, or daily reflections.
    """
    __tablename__ = 'journals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    entry_text = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
