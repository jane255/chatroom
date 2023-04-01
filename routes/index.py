from flask import (
    Blueprint,
    redirect,
    url_for, render_template, request,
)
from flask_login import login_user

from models.user import User
from routes import current_user, session
from utils import log

main = Blueprint('', __name__)


@main.route('/')
def index():
    log("初始化进入 index")
    # 返回一个 templates 文件夹下的 html 页面
    # if current_user.is is None:
    #     # avatar_list = all_avatar()
    #     return render_template("login.html")
    # current = User.find(session.get("user_id"))
    # log("current", current)
    if current_user.is_authenticated:
    # if current:
        log("index 验证通过 --------------")
        return redirect(url_for('chat.index'))
    else:
        log("index 验证没通过")
        return render_template("login.html")


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
        #
        log("登录成功", u.is_active)
        re = login_user(u)
        log("login_user 结果", re, current_user.id, current_user.is_active)
        #
        return redirect(url_for('chat.index'))


@main.route('/profile')
def profile():
    return render_template('profile.html', user=current_user)
