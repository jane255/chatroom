import functools

from flask import Flask, request, render_template, redirect, url_for, session, make_response
from flask_socketio import SocketIO, emit

from user import User
from msg import Message
from utils import log, random_str

app = Flask(__name__)
app.config['SECRET_KEY'] = 'axe'

# 此处务必添加支持跨域
socketio = SocketIO(app, cors_allowed_origins='*')


def current_user():
    # 从 session 中找到 user_id 字段, 找不到就 -1
    # 然后 User.find_by 来用 id 找用户
    # 找不到就返回 None
    uid = session.get('user_id', -1)
    u = User.find_by(id=uid)
    return u


def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        log("authenticated_only", session, f)
        if current_user() is None:
            return disconnect()
        else:
            return f(*args, **kwargs)

    return wrapped


@socketio.on('connect')
@authenticated_only
def connect(auth):
    log('client connect...')


@socketio.on('disconnect')
def disconnect():
    print('client disconnect...')


@socketio.on('message')
@authenticated_only
def test_message(data):
    print(f"client send message={data}")
    u = current_user()
    m = Message(dict(
        user_id=u.id,
        msg=data.get('msg', ''),
    ))
    m.save()
    d = dict(
        user_id=u.id,
        username=u.username,
        msg=m.msg,
        msg_id=m.id,
    )
    emit('msg_list', d, broadcast=True)


@socketio.on('my event')
def test_my_event(data):
    print('my-event => ', data)


@socketio.on('test')
def test_ret(data):
    print('test => ', data)


@app.route("/")
def index():
    u = current_user()
    log("请求 index", u)
    if u is None:
        return render_template("login.html")
    else:
        # return render_template('profile.html', user=u)
        return render_template("connect-js.html", user=u)


@app.route("/register", methods=['POST'])
def register():
    form = request.form
    u = User.register(form)
    return redirect(url_for('.index'))


@app.route("/login", methods=['POST'])
def login():
    form = request.form
    u = User.validate_login(form)
    if u is None:
        return render_template("register.html")
    else:
        # session 中写入 user_id
        session['user_id'] = u.id
        session.permanent = True
        log('session', session)
        #
        # template = render_template("index.html", user=u)
        # # 如果要写入 cookie, 必须使用 make_response 函数
        # # 然后再用 set_cookie 来设置 cookie
        # r = make_response(template)
        # r.set_cookie('cookie_name', 'GUA')
        return render_template("connect-js.html", user=u)
        # return redirect(url_for('.profile'))


@app.route('/profile')
def profile():
    u = current_user()
    if u is None:
        return redirect(url_for('.index'))
    else:
        return render_template('profile.html', user=u)


if __name__ == '__main__':
    session.clear()
    socketio.run(
        app,
        debug=True,
    )
