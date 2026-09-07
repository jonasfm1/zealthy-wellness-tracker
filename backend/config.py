import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()


class Config:
    """
    Configuration class for Flask application.
    Secures sensitive credentials by loading them from environment variables.
    """
    # Secret key for JWT token generation and session encryption
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback-dev-secret-key')

    # Database connection URI. Falls back to a local SQLite database if MySQL/Aiven URI is not set yet.
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 'sqlite:///local_fallback.db')

    # Disable SQLAlchemy modification tracking to save system resources
    SQLALCHEMY_TRACK_MODIFICATIONS = False
