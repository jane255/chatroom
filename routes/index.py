from flask import (
    Blueprint,
    redirect,
    url_for, session, render_template, request,
)

from models.msg import Message
from models.user import User
from routes import current_user
from utils import log

main = Blueprint('', __name__)


@main.route('/')
def index():
    # 返回一个 templates 文件夹下的 html 页面
    u = current_user()
    if u is None:
        # avatar_list = all_avatar()
        return render_template("login.html")
    else:
        msg_list = []
        for m in Message.all():
            d = vars(m)
            d['username'] = "我" if m.user_id == u.id else User.find(id=m.user_id).username
            msg_list.append(d)
        return render_template("chat.html", user=u, msg_list=msg_list)


@main.route("/register", methods=['POST'])
def register():
    form = request.form
    log("register form", form)
    u = User.register(form)
    return redirect(url_for('.index'))


@main.route("/login", methods=['POST'])
def login():
    form = request.form
    log("login form", form)
    u = User.validate_login(form)
    if u is None:
        return render_template("register.html")
    else:
        # session 中写入 user_id
        session['user_id'] = u.id
        session.permanent = True
        return redirect(url_for('.index'))


@main.route('/profile')
def profile():
    u = current_user()
    if u is None:
        return redirect(url_for('.index'))
    else:
        return render_template('profile.html', user=u)
