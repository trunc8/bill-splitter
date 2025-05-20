import os
import json
import sys
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='build')
# Updated CORS configuration with specific frontend URL
CORS(app, resources={r"/api/*": {"origins": [
    "https://smart-bill-splitter.netlify.app",  # Your Netlify frontend
    "http://localhost:3000",  # For local development
    os.environ.get("FRONTEND_URL", "*")  # From environment variable (fallback)
]}})

# Data storage using JSON file as a simple database
# On Heroku, use a directory that's writable
if 'DYNO' in os.environ:  # Check if running on Heroku
    DB_FILE = os.path.join('/tmp', 'bill_splitter_db.json')
else:
    DB_FILE = os.environ.get('DB_FILE', 'bill_splitter_db.json')

# Initialize database
def load_from_db():
    global dishes, people, selections
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r') as f:
                data = json.load(f)
                dishes = data.get('dishes', [])
                people = data.get('people', [])
                selections = data.get('selections', {})
        except Exception as e:
            print(f"Error loading from database: {e}")
            dishes = []
            people = []
            selections = {}
    else:
        dishes = []
        people = []
        selections = {}

def save_to_db():
    with open(DB_FILE, 'w') as f:
        json.dump({
            'dishes': dishes,
            'people': people,
            'selections': selections
        }, f)

# Initialize data
dishes = []
people = []
selections = {}

@app.route('/api/dishes', methods=['GET', 'POST'])
def handle_dishes():
    global dishes
    if request.method == 'POST':
        dishes = request.json
        save_to_db()
        return jsonify({"status": "success", "dishes": dishes})
    return jsonify(dishes)

@app.route('/api/people', methods=['GET', 'POST'])
def handle_people():
    global people
    if request.method == 'POST':
        people = request.json
        save_to_db()
        return jsonify({"status": "success", "people": people})
    return jsonify(people)

@app.route('/api/selections', methods=['GET', 'POST'])
def handle_selections():
    global selections
    if request.method == 'POST':
        selections = request.json
        save_to_db()
        return jsonify({"status": "success", "selections": selections})
    return jsonify(selections)

@app.route('/api/calculate', methods=['POST'])
def calculate_split():
    global selections
    selections = request.json
    save_to_db()  # Save selections when calculating
    
    # Initialize the amount each person owes
    result = {person: 0.0 for person in people}
    
    # Calculate split based on selections
    for dish_id, dish_info in enumerate(dishes):
        if dish_id < len(dishes):  # Make sure dish_id is valid
            price = float(dish_info.get('price', 0))
            eaters = selections.get(str(dish_id), [])
            
            if eaters:
                share = price / len(eaters)
                for eater in eaters:
                    if eater in result:
                        result[eater] += share
    
    return jsonify(result)

@app.route('/api/reset', methods=['POST'])
def reset_data():
    global dishes, people, selections
    dishes = []
    people = []
    selections = {}
    save_to_db()
    return jsonify({"status": "success", "message": "All data has been reset"})

# Serve React static files in production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    load_from_db()  # Load data from database when starting
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', debug=debug, port=port)
