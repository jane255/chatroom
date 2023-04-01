from flask import Blueprint
from flask import render_template

from models.msg import Message
from models.user import User
from routes import current_user
from utils import log

main = Blueprint('chat', __name__)


@main.route('/')
def index():
    # # 返回一个 templates 文件夹下的 html 页面
    # u = current_user()
    # log("请求 index", u)
    # if u is None:
    #     # avatar_list = all_avatar()
    #     return render_template("login.html")
    # else:
    #     msg_list = []
    #     for m in Message.all():
    #         d = vars(m)
    #         d['username'] = "我" if m.user_id == u.id else User.find(id=m.user_id).username
    #         msg_list.append(d)
    #     # log("msg_list", msg_list)
    #     return render_template("chat.html", user=u, msg_list=msg_list)
    pass
