# Advanced Bill Splitter Web App

This is an enhanced version of the bill splitter application with a modern React frontend and Flask backend.

## Features

- Add and remove dishes with names and prices
- Add and remove people who are splitting the bill
- Select who had each dish with checkboxes
- Automatically calculate how much each person owes
- Modern, responsive UI built with Material UI
- RESTful API backend with Flask

## Project Structure

```
advanced_splitter/
  ├── backend/
  │   └── app.py - Flask server with REST API
  └── frontend/
      ├── public/ - Static assets
      └── src/ - React components and styles
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install flask flask-cors
   ```
4. Run the Flask server:
   ```
   python app.py
   ```
   The API will be available at http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   The app will open at http://localhost:3000

## API Endpoints

- `GET /api/dishes` - Get all dishes
- `POST /api/dishes` - Update dishes
- `GET /api/people` - Get all people
- `POST /api/people` - Update people
- `POST /api/calculate` - Calculate bill split

## Deployment

### Web Deployment (Render.com)

#### Backend Deployment
1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Use the following settings:
   - Name: bill-splitter-backend
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. Add the following environment variables:
   - `FRONTEND_URL`: URL of your frontend app (once deployed)
   - `DB_FILE`: Path to the database file (e.g., `/var/lib/render/bill_splitter_db.json`)

#### Frontend Deployment
1. Create a new Static Site on Render.com
2. Connect your GitHub repository
3. Use the following settings:
   - Name: bill-splitter-frontend
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
4. Add the following environment variables:
   - `REACT_APP_API_URL`: URL of your backend API (from step above)

### Alternative Deployment Options

#### Backend: Heroku/Railway
- Create a free account
- Connect your GitHub repo
- Add a Procfile in the backend directory with: `web: gunicorn app:app`
- Deploy the application

#### Frontend: Netlify/Vercel
- Create a free account
- Connect your GitHub repo
- Set the build command to: `cd frontend && npm install && npm run build`
- Set the publish directory to: `frontend/build`
- Add the backend URL as an environment variable: `REACT_APP_API_URL`

## Local Deployment

For a local production deployment:

1. Build the React app:
   ```
   cd frontend
   npm run build
   ```
2. Copy the build folder to the Flask static folder
3. Run the Flask app in production mode

## License

MIT
