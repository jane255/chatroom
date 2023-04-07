from flask import Blueprint, request
from flask import render_template

from models.msg import Message
from models.room import Room, room_members_dict
from models.user import User
from routes import current_user, login_required
from utils import log

main = Blueprint('chat', __name__)


@main.route('/')
@login_required
def index():
    # 返回一个 templates 文件夹下的 html 页面
    # 获取所有房间
    room_list = Room.all()
    room: Room = Room.find(request.args.get("room_id", 1))
    # msg
    msg_list = []
    current: User = current_user()

    for m in Message.find_all(room_id=room.id):
        d = vars(m)
        if m.user_id == current.id:
            d['username'] = "我"
            d['avatar'] = current.avatar
        else:
            user = User.find(id=m.user_id)
            d['username'] = user.username
            d['avatar'] = user.avatar
        msg_list.append(d)

    # 用户
    member_list = [
        User.find(i) for i in room_members_dict.members_from_room_id(room_id=room.id)
    ]
    return render_template(
        "chat.html",
        current_room=room,
        current_user=current,
        room_list=room_list,
        msg_list=msg_list,
        member_list=member_list,
    )


@main.route('/detail', methods=['POST'])
@login_required
def detail():
    form = request.get_json()
    log("detail form", form)
    room: Room = Room.find(form.get("room_id", 1))
    # msg
    msg_list = []
    for m in Message.find_all(room_id=room.id):
        d = vars(m)
        user = User.find(id=m.user_id)
        d['username'] = user.username
        d['avatar'] = user.avatar
        msg_list.append(d)

    # 用户
    member_list = [
        vars(User.find(i)) for i in room_members_dict.members_from_room_id(room_id=room.id)
    ]
    return dict(
        room=vars(room),
        msg_list=msg_list,
        member_list=member_list,
    )
