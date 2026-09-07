from app import create_app
from models import db, User, Hydration, Nutrition, Exercise, Journal
import bcrypt
from datetime import datetime, timedelta

# Initialize the Flask application context
app = create_app()

with app.app_context():
    print("Checking database tables...")
    db.create_all()

    alice_email = "alice@email.net"

    # Check if Alice already exists to avoid duplicate entries
    if not User.query.filter_by(email=alice_email).first():
        print("Creating Alice's account...")

        # Hash the required 'password' securely using bcrypt
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(
            "password".encode('utf-8'), salt
        ).decode('utf-8')

        # Create Alice user instance using the correct model attribute name -> 'password_hash'
        alice = User(email=alice_email, password_hash=hashed_pw)
        db.session.add(alice)
        db.session.commit()  # Commit to generate the user ID

        print("Seeding wellness data...")
        today = datetime.now().date()

        # Insert 3 days of historical data for comprehensive dashboard testing
        for i in range(3):
            past_date = today - timedelta(days=i)

            # Hydration (Glasses of water)
            db.session.add(Hydration(
                user_id=alice.id, 
                glasses=6 + i, 
                date=past_date
            ))

            # Nutrition (Calories consumed)
            db.session.add(Nutrition(
                user_id=alice.id, 
                calories=2100 - (i * 150), 
                date=past_date
            ))

            # Exercise (Duration in minutes)
            db.session.add(Exercise(
                user_id=alice.id, 
                exercise_type="Yoga", 
                duration_minutes=45 + (i * 5), 
                date=past_date
            ))

            # Free-form Journal entry
            db.session.add(Journal(
                user_id=alice.id, 
                entry_text=f"Day {-i} reflection: Feeling energized and focused on wellness today.", 
                date=past_date
            ))

        db.session.commit()
        print("Successfully seeded Alice's account with historical wellness data!")
    else:
        print("Alice's account already exists in the database. Skipping seed.")