from flask import Blueprint
from flask import render_template

from models.group import Group
from models.msg import Message
from models.user import User
from routes import current_user, login_required

main = Blueprint('chat', __name__)


@main.route('/')
@login_required
def index():
    # 返回一个 templates 文件夹下的 html 页面
    # group
    group_list = Group.all()

    # msg
    msg_list = []
    current = current_user()
    for m in Message.all():
        d = vars(m)
        if m.user_id == current.id:
            d['username'] = "我"
            d['avatar'] = current.avatar
        else:
            user = User.find(id=m.user_id)
            d['username'] = user.username
            d['avatar'] = user.avatar
        msg_list.append(d)
    # log("msg_list", msg_list)

    # 用户
    user_list = User.all()
    return render_template(
        "chat.html",
        user=current,
        group_list=group_list,
        msg_list=msg_list,
        user_list=user_list,
    )
