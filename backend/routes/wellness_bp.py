from flask import Blueprint, request, jsonify
import jwt
from functools import wraps
import os
from models import db, User, Hydration, Nutrition, Exercise, Journal
from datetime import datetime

wellness_bp = Blueprint('wellness', __name__)


def token_required(f):
    """
    Security middleware to protect routes.
    Checks for a valid Bearer JWT in the Authorization header.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token is missing or invalid format'}), 401
 
        try:
            token = auth_header.split(" ")[1]
            
            secret_key = os.getenv('JWT_SECRET_KEY', 'fallback-dev-secret-key')
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                raise Exception("User not found")
        except Exception as e:
            return jsonify({'error': 'Token is invalid or expired'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


@wellness_bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard_data(current_user):
    """
    Fetch all custom wellness data for the authenticated user.
    """
    # Fetch data and format it into lists of dictionaries
    hydration = [{'id': h.id, 'glasses': h.glasses, 'date': h.date.isoformat()} for h in current_user.hydration_records]
    nutrition = [{'id': n.id, 'calories': n.calories, 'date': n.date.isoformat()} for n in current_user.nutrition_records]
    exercises = [{'id': e.id, 'type': e.exercise_type, 'duration': e.duration_minutes, 'date': e.date.isoformat()} for e in current_user.exercise_records]
    journals = [{'id': j.id, 'text': j.entry_text, 'date': j.date.isoformat()} for j in current_user.journal_records]

    return jsonify({
        'hydration': hydration,
        'nutrition': nutrition,
        'exercises': exercises,
        'journals': journals
    }), 200


@wellness_bp.route('/hydration', methods=['POST'])
@token_required
def add_hydration(current_user):
    data = request.get_json()
    new_record = Hydration(
        user_id=current_user.id,
        glasses=data.get('glasses'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date()
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Hydration logged successfully'}), 201


@wellness_bp.route('/nutrition', methods=['POST'])
@token_required
def add_nutrition(current_user):
    """
    Saves a new nutrition record (calories) for the authenticated user.
    """
    data = request.get_json()
    new_record = Nutrition(
        user_id=current_user.id,
        calories=data.get('calories'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date()
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Nutrition logged successfully'}), 201


@wellness_bp.route('/exercise', methods=['POST'])
@token_required
def add_exercise(current_user):
    """
    Saves a new exercise record (duration in minutes) for the authenticated user.
    """
    data = request.get_json()
    new_record = Exercise(
        user_id=current_user.id,
        exercise_type=data.get('type', 'General'),
        duration_minutes=data.get('duration'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date()
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Exercise logged successfully'}), 201


@wellness_bp.route('/journal', methods=['POST'])
@token_required
def add_journal(current_user):
    """
    Saves a new daily journal text entry for the authenticated user.
    """
    data = request.get_json()
    new_record = Journal(
        user_id=current_user.id,
        entry_text=data.get('text'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date()
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Journal logged successfully'}), 201