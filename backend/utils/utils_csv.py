import csv
from io import StringIO
from dateutil import parser
from models import Event
from database import db

def import_events_from_csv(file_stream):
    text = file_stream.read().decode('utf-8')
    reader = csv.DictReader(StringIO(text))
    created = []
    errors = []
    for idx, row in enumerate(reader, start=1):
        try:
            title = row.get('title') or ''
            if not title:
                raise ValueError('Missing title')
            date = parser.parse(row.get('date'))
            description = row.get('description') or ''
            location = row.get('location') or ''
            capacity = int(row.get('capacity') or 0)
            ticket_price = float(row.get('ticket_price') or 0.0)
            ev = Event(
                title=title.strip(),
                description=description.strip(),
                date=date,
                location=location.strip(),
                capacity=capacity,
                ticket_price=ticket_price
            )
            db.session.add(ev)
            created.append(title)
        except Exception as e:
            errors.append({'row': idx, 'error': str(e)})
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        errors.append({'commit_error': str(e)})
    return {'created': created, 'errors': errors}
