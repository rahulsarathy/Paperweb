import googlemaps
from googlemaps.places import places_autocomplete
from pulp.globals import GOOGLE_MAPS_PLACES
import uuid


gmaps = googlemaps.Client(key=GOOGLE_MAPS_PLACES)

def autocomplete(address):

    session_token = uuid.uuid4().hex

    google_response = places_autocomplete(session_token=session_token, input_text=address)

    return google_response