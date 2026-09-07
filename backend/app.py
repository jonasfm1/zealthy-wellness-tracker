import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from models import db

# Import Blueprints
from routes.auth_bp import auth_bp
from routes.wellness_bp import wellness_bp
from routes.external_bp import external_bp

# Load environment variables from the .env file before initializing the app
load_dotenv()

def create_app():
    """
    Application factory function.
    Initializes the Flask app, database, CORS, and registers blueprints.
    """
    app = Flask(__name__)
    
    # Load configuration from config.py (ensure config.py also uses os.getenv for secrets)
    app.config.from_object(Config)

    # SECURITY: Restrict CORS to only allow requests from the designated frontend URL
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    CORS(app, resources={r"/api/*": {"origins": frontend_url}})

    # Initialize Database
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(wellness_bp, url_prefix='/api/wellness')
    app.register_blueprint(external_bp, url_prefix='/api/external')

    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    
    # SECURITY: Dynamic debug mode prevents accidental debug exposure in production
    debug_mode = os.getenv('FLASK_DEBUG', 'True').lower() in ['true', '1', 't']
    
    # Run the server on port 5000
    app.run(debug=debug_mode, port=5000)