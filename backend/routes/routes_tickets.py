from flask import Blueprint, jsonify
from models import Event

bp = Blueprint('tickets', __name__, url_prefix='/api/tickets')

# Ticket sales report
@bp.route('/report', methods=['GET'])
def sales_report():
    events = Event.query.order_by(Event.date).all()
    report = []
    total_revenue = 0.0
    total_tickets = 0
    for ev in events:
        revenue = ev.tickets_sold * ev.ticket_price
        report.append({
            'event_id': ev.id,
            'title': ev.title,
            'tickets_sold': ev.tickets_sold,
            'capacity': ev.capacity,
            'tickets_available': max(ev.capacity - ev.tickets_sold, 0),
            'revenue': revenue
        })
        total_revenue += revenue
        total_tickets += ev.tickets_sold
    return jsonify({'events': report, 'total_revenue': total_revenue, 'total_tickets': total_tickets})
