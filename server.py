from flask import Flask
from flask_http_middleware import MiddlewareManager
from flask_login import LoginManager
from pydantic import ValidationError
from werkzeug.exceptions import HTTPException

import config
from flask_session import Session
from middlewares.metrics import MetricsMiddleware
from middlewares.resp import RespMiddleware
from models.user import User
from routes import ResponseModel
from utils import log


def register_routes(a):
    # 注册路由函数
    from routes.index import main as index_blueprint
    from routes.chat import main as chat_blueprint

    a.register_blueprint(index_blueprint, url_prefix='/')
    a.register_blueprint(chat_blueprint, url_prefix='/chat')


def register_middleware(a):
    a.wsgi_app = MiddlewareManager(a)
    # 先注册的中间件最后执行
    a.wsgi_app.add_middleware(RespMiddleware)
    # 统计请求耗时中间件需要放在最后
    a.wsgi_app.add_middleware(MetricsMiddleware)


def register_error_handlers(a):
    @a.errorhandler(Exception)
    def error_handler(e):
        if isinstance(e, HTTPException):
            log(e)
            return ResponseModel(code=e.code, message=e.description).json()
        if isinstance(e, ValidationError):
            return ResponseModel(code=400, message=f'Params Invalid:{e.errors()}').json()
        return ResponseModel(code=500, message=repr(e)).json()


def configured_app():
    a = Flask(__name__, template_folder=config.templates_dir, static_folder=config.static_dir)
    a.config['SECRET_KEY'] = 'secret_key'
    a.config['SESSION_TYPE'] = 'filesystem'
    Session(a)

    register_routes(a)
    register_middleware(a)
    # register_error_handlers(a)

    return a


app = configured_app()
# 这个文件都是套路写法


login = LoginManager(app)


@login.user_loader
def load_user(id):
    log("load_user", id)
    return User.find(int(id))

