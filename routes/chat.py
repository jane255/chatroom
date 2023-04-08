from flask import Blueprint, request
from flask import render_template

from models.msg import Message, ReadRecord
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
    room_id = request.args.get("room_id", 1)
    current: User = current_user()
    room_detail = get_room_detail(room_id=room_id)
    room = room_detail.get('room')
    msg_list = room_detail.get('msg_list')
    member_list = room_detail.get('member_list')
    read_id = room_detail.get('read_id')

    return render_template(
        "chat.html",
        current_room=room,
        current_user=current,
        room_list=room_list,
        msg_list=msg_list,
        member_list=member_list,
        read_id=read_id,
    )


def get_room_detail(room_id):
    current = current_user()
    # 房间
    room: Room = Room.find(room_id)
    # 消息列表
    msg_list = []
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

    # 在线用户
    member_list = []
    for user_id in room_members_dict.members_from_room_id(room_id=room.id):
        u = User.find(user_id)
        d = dict(
            user_id=user_id,
            username=u.username,
            avatar=u.avatar,
        )
        member_list.append(d)
    # 已读消息最新 id
    read_record = ReadRecord.find_by(user_id=current.id, room_id=room_id)
    read_id = -1 if read_record is None else read_record.msg_id

    return dict(
        room=vars(room),
        msg_list=msg_list,
        member_list=member_list,
        read_id=read_id,
    )


@main.route('/detail', methods=['POST'])
@login_required
def detail():
    form = request.get_json()
    log("detail form", form)
    room_id = form.get("room_id", 1)
    return get_room_detail(room_id)
