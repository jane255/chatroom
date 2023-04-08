from flask import Blueprint, jsonify, request

from models.room import Room
from routes import login_required, current_user
from utils import log

main = Blueprint('room', __name__)


@main.route('/')
@login_required
def index():
    room_list = Room.all()
    return jsonify(room_list)


@main.route('/add', methods=['POST'])
@login_required
def add():
    form = request.get_json()
    log("add form", form)
    u = current_user()
    g = Room(form)
    g.create_user_id = u.id
    g.save()
    return dict(room_id=g.id, name=g.name)
