from database import db
from datetime import datetime

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=True)
    capacity = db.Column(db.Integer, nullable=False, default=0)
    ticket_price = db.Column(db.Float, nullable=False, default=0.0)
    tickets_sold = db.Column(db.Integer, nullable=False, default=0)
    attendees = db.relationship('Attendee', backref='event', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat(),
            'location': self.location,
            'capacity': self.capacity,
            'ticket_price': self.ticket_price,
            'tickets_sold': self.tickets_sold,
            'tickets_available': max(self.capacity - self.tickets_sold, 0)
        }

class Attendee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'event_id': self.event_id,
            'registered_at': self.registered_at.isoformat()
        }
