from flask import (
    Blueprint,
    redirect,
    url_for,
    render_template,
    request,
)

from models.user import User
from routes import current_user, session, login_required
from utils import log, all_avatar

main = Blueprint('', __name__)


@main.route('/')
@login_required
def index():
    log("初始化进入 index")
    return redirect(url_for('chat.index'))


# @main.route("/register", methods=['POST'])
def register():
    form = request.form
    log("register form", form)
    u = User.register(form)
    # return redirect(url_for('.index'))


@main.route("/login", methods=['POST'])
def login():
    form = request.form
    log("login form", form)
    u = User.validate_login(form)
    if u is None:
        register()
    # session 中写入 user_id
    session['user_id'] = u.id
    session.permanent = True
    #
    return redirect(url_for('chat.index'))


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', user=current_user)


@main.route("/logout")
@login_required
def logout():
    session.pop('user_id')
    #
    return redirect(url_for('.index'))
