from flask import Blueprint, request, jsonify
from models import Event
from database import db
from dateutil import parser

bp = Blueprint('events', __name__, url_prefix='/api/events')


# ===== GET all events =====
@bp.route('', methods=['GET'])
def list_events():
    events = [e.to_dict() for e in Event.query.order_by(Event.date).all()]
    return jsonify(events), 200


# ===== GET single event =====
@bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    return jsonify(event.to_dict()), 200


# ===== CREATE event =====
@bp.route('', methods=['POST'])
def create_event():
    data = request.get_json() or {}
    try:
        ev = Event(
            title=data.get('title', ''),
            description=data.get('description', ''),
            date=parser.parse(data.get('date')),
            location=data.get('location', ''),
            capacity=int(data.get('capacity') or 0),
            ticket_price=float(data.get('ticket_price') or 0.0)
        )
        db.session.add(ev)
        db.session.commit()
        return jsonify(ev.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# ===== UPDATE event =====
@bp.route('/<int:event_id>', methods=['PUT', 'PATCH'])
def update_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    data = request.get_json() or {}
    try:
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'date' in data:
            event.date = parser.parse(data['date'])
        if 'location' in data:
            event.location = data['location']
        if 'capacity' in data:
            event.capacity = int(data['capacity'])
        if 'ticket_price' in data:
            event.ticket_price = float(data['ticket_price'])

        db.session.commit()
        return jsonify(event.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# ===== DELETE event =====
@bp.route('/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': f'Event {event_id} deleted successfully'}), 200
