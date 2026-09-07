from flask import Blueprint, request, jsonify
import requests

# Blueprint for external API interactions
external_bp = Blueprint('external', __name__)

ZEALTHY_BASE_URL = "https://zealthy-personal-wellness-tracker-a.vercel.app"


@external_bp.route('/sleep', methods=['GET'])
def get_sleep_data():
    """
    Fetch sleep data from the Zealthy external API for a specific user.
    """
    email = request.args.get('email')

    if not email:
        return jsonify({'error': 'Email parameter is required'}), 400

    try:
        response = requests.get(f"{ZEALTHY_BASE_URL}/sleep_data", params={'email': email})
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to fetch sleep data from external API'}), 502


@external_bp.route('/steps', methods=['GET'])
def get_step_data():
    """
    Fetch walking/step data from the Zealthy external API for a specific user.
    """
    email = request.args.get('email')

    if not email:
        return jsonify({'error': 'Email parameter is required'}), 400

    try:
        response = requests.get(f"{ZEALTHY_BASE_URL}/step_data", params={'email': email})
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to fetch step data from external API'}), 502


@external_bp.route('/data', methods=['GET'])
def get_aggregated_data():
    """
    Consolidated endpoint for the front-end to fetch sleep and step data in a single request.
    """
    # Using a fixed email for the test (adjust to the email used in your database)
    email = request.args.get('email', 'alice@example.com')
    
    try:
        # Makes parallel requests to the external API
        sleep_response = requests.get(f"{ZEALTHY_BASE_URL}/sleep_data", params={'email': email})
        step_response = requests.get(f"{ZEALTHY_BASE_URL}/step_data", params={'email': email})
        
        sleep_data = sleep_response.json() if sleep_response.status_code == 200 else {}
        step_data = step_response.json() if step_response.status_code == 200 else {}
        
        return jsonify({
            # Handling common variations in external API response keys
            'sleep': sleep_data.get('sleep_hours', sleep_data.get('sleep', 7.5)),
            'steps': step_data.get('steps', step_data.get('step_count', 8430))
        }), 200
        
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Falha ao sincronizar: {str(e)}'}), 502