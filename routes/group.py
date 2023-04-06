from flask import Blueprint, jsonify

from models.group import Group
from routes import login_required

main = Blueprint('group', __name__)


@main.route('/')
@login_required
def index():
    group_list = Group.all()
    return jsonify(group_list)
