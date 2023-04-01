from flask import Blueprint
from flask import render_template
from flask_login import login_required

from models.msg import Message
from models.user import User
from routes import current_user
from utils import log

main = Blueprint('chat', __name__)


@main.route('/')
@login_required
def index():
    # # 返回一个 templates 文件夹下的 html 页面
    msg_list = []
    for m in Message.all():
        d = vars(m)
        d['username'] = "我" if m.user_id == current_user.id else User.find(id=m.user_id).username
        msg_list.append(d)
    # log("msg_list", msg_list)
    return render_template("chat.html", user=current_user, msg_list=msg_list)
