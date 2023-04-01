import functools

from flask_login import current_user
from flask_socketio import disconnect
from pydantic import BaseModel
from flask import session

from utils import log


class ResponseModel(BaseModel):
    code: int = 0
    message: str = 'success'
    data: dict = {}
    # TODO: get version from changelog
    # version = version
    env = 'local'


# def current_user():
#     # 从 session 中找到 user_id 字段, 找不到就 -1
#     # 然后 User.find_by 来用 id 找用户
#     # 找不到就返回 None
#     uid = session.get('user_id', -1)
#     u = User.find_by(id=uid)
#     return u


def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            log("socket 连接失败")
            disconnect()
        else:
            return f(*args, **kwargs)

    return wrapped
