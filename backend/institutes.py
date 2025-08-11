from flask import Blueprint, request, jsonify
import requests

institutes_blueprint = Blueprint('institutes', __name__)

API_KEY = "7856d350-1fda-45f5-822d-e1a2f3f1acf0"
KRETA_SCHOOLS_URL = "https://kretaglobalmobileapi2.ekreta.hu/api/v3/Institute"

@institutes_blueprint.route('/api/institutes')
def institutes():
    query = request.args.get('q', '').lower()
    headers = {'apiKey': API_KEY}
    response = requests.get(KRETA_SCHOOLS_URL, headers=headers)
    schools = response.json()
    if query:
        filtered = [school for school in schools if query in school['name'].lower()]
    else:
        filtered = schools
    return jsonify(filtered)
