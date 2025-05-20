import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

try:
    from backend.app import app
except ImportError:
    try:
        from app import app
    except ImportError:
        print("Error: Cannot import app module. Check file structure.")
        sys.exit(1)

# Initialize the app by loading the database
try:
    from backend.app import load_from_db
    load_from_db()
except ImportError:
    try:
        from app import load_from_db
        load_from_db()
    except (ImportError, AttributeError):
        print("Warning: Could not load database. App might not function properly.")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
