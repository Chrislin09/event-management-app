from flask import Blueprint, request, jsonify
from models import Attendee, Event
from database import db

bp = Blueprint('attendees', __name__, url_prefix='/api/attendees')


# ===== List all attendees for all events =====
@bp.route('', methods=['GET'])
def list_all_attendees():
    attendees = [a.to_dict() for a in Attendee.query.all()]
    return jsonify(attendees), 200


# ===== List attendees for a specific event =====
@bp.route('/event/<int:event_id>', methods=['GET'])
def list_attendees(event_id):
    ev = Event.query.get_or_404(event_id)
    return jsonify([a.to_dict() for a in ev.attendees]), 200


# ===== Register a new attendee for a specific event =====
@bp.route('/event/<int:event_id>', methods=['POST'])
def register_attendee(event_id):
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')

    if not (name and email):
        return jsonify({'error': 'Name and email are required'}), 400

    ev = Event.query.get_or_404(event_id)
    if ev.tickets_sold >= ev.capacity:
        return jsonify({'error': 'Event sold out'}), 400

    # Prevent duplicate registration by email for this event
    if Attendee.query.filter_by(email=email, event_id=event_id).first():
        return jsonify({'error': 'Attendee already registered for this event'}), 400

    new_attendee = Attendee(name=name, email=email, event_id=event_id)
    db.session.add(new_attendee)
    ev.tickets_sold += 1
    db.session.commit()
    return jsonify(new_attendee.to_dict()), 201


# ===== Update attendee info (name/email only) =====
@bp.route('/<int:attendee_id>', methods=['PUT', 'PATCH'])
def update_attendee(attendee_id):
    attendee = Attendee.query.get_or_404(attendee_id)
    data = request.get_json() or {}

    if 'name' in data:
        attendee.name = data['name']

    if 'email' in data:
        # Check duplicate email for the same event
        if Attendee.query.filter_by(email=data['email'], event_id=attendee.event_id).first():
            return jsonify({'error': 'Email already registered for this event'}), 400
        attendee.email = data['email']

    db.session.commit()
    return jsonify(attendee.to_dict()), 200


# ===== Delete attendee from an event =====
@bp.route('/<int:attendee_id>', methods=['DELETE'])
def delete_attendee(attendee_id):
    attendee = Attendee.query.get_or_404(attendee_id)
    ev = Event.query.get(attendee.event_id)

    db.session.delete(attendee)
    if ev and ev.tickets_sold > 0:
        ev.tickets_sold -= 1

    db.session.commit()
    return jsonify({'message': f'Attendee {attendee_id} removed from event {ev.id} successfully'}), 200