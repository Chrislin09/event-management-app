from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from utils.utils_csv import import_events_from_csv
import routes.routes_events, routes.routes_attendees, routes.routes_tickets

def create_app(db_path='sqlite:///events.db'):
    app = Flask(__name__, static_folder='../frontend', static_url_path='/')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)
    db.init_app(app)

    # register blueprints
    app.register_blueprint(routes.routes_events.bp)
    app.register_blueprint(routes.routes_attendees.bp)
    app.register_blueprint(routes.routes_tickets.bp)

    # Frontend
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    # CSV import
    @app.route('/api/import_csv', methods=['POST'])
    def import_csv():
        if 'file' not in request.files:
            return jsonify({'error': 'file missing'}), 400
        f = request.files['file']
        res = import_events_from_csv(f.stream)
        return jsonify(res)

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
