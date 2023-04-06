from flask import Blueprint, jsonify, request

from models.group import Group
from routes import login_required
from utils import log

main = Blueprint('group', __name__)


@main.route('/')
@login_required
def index():
    group_list = Group.all()
    return jsonify(group_list)


@main.route('/add', methods=['POST'])
@login_required
def add():
    form = request.get_json()
    log("add form", form)
    g = Group(form)
    g.save()
    return dict(group_id=g.id)
