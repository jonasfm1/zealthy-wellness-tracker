# Zealthy Personal Wellness Tracker

A full-stack web application designed to track personal wellness metrics. It seamlessly integrates external time-series data (sleep and steps) with custom, user-defined metrics (hydration, calories consumed, and a free-form wellness journal).

**Frontend Deployment:** [Your Vercel URL here]
**Backend API:** [Your Render URL here]

## Tech Stack & Architecture
* **Frontend:** Next.js (App Router), Bootstrap 5, Axios, Chart.js. Built with Atomic Design principles and a mobile-first approach.
* **Backend:** Python / Flask, SQLAlchemy, PyJWT, bcrypt. 
* **Database:** MySQL (Hosted on Aiven).
* **Security:** JWT-based stateless authentication, password hashing (bcrypt), and protected RESTful API endpoints. 

## Features
* Secure Sign Up and Login system.
* Automated integration with Zealthy's external read-only API for Sleep and Walking data for demo accounts.
* Custom tracking for Water Intake (glasses) and Calories.
* Free-form text journal for daily wellness notes.
* Dynamic charting and data visualization.

## Demo Accounts
The following test accounts have full access to the external step and sleep data:
* `alice@email.net` (Password: `password`) - **Pre-seeded with custom hydration, calorie, and journal data.**
* `bob@email.net`
* `ming@email.net`

2. Backend Setup
  **Bash**
  `cd backend`
  `python3 -m venv venv`
  `source venv/bin/activate`
  `pip install -r requirements.txt`

## Create a .env file in the backend directory to securely store your credentials:
  DATABASE_URL=mysql+pymysql://<user>:<password>@<host>:<port>/<dbname>JWT_SECRET_KEY=your_super_secret_key

Initialize the database and seed the test user (Alice):
  python seed.py
  python app.py