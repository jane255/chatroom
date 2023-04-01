from flask_socketio import SocketIO

from routes.event import ChatRoomNamespace
from server import app


def configured_socket_app():
    # 套路写法
    s = SocketIO(app, cors_allowed_origins='*')
    # 注册一个命名空间
    chat_room_namespace = ChatRoomNamespace('/chat')
    s.on_namespace(chat_room_namespace)
    # 默认 socket 自行管理 session，但是我们这里直接关闭
    # 开启的话，路由函数的 session 就不会共享到 ChatRoomNamespace.on_message 方法中
    s.manage_session = False
    return s


socketio = configured_socket_app()
