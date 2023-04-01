from flask_socketio import Namespace
from flask_socketio import emit
from flask_socketio import join_room
from flask_socketio import leave_room

from models.msg import Message
from routes import current_user, session
from utils import log


class ChatRoomNamespace(Namespace):
    @staticmethod
    # @authenticated_only
    def on_connect():
        log('客户端连接')
        # 加入房间，房间名是 chat
        join_room('chat')
        log("on_connect", current_user.get_id(), session.get("user_id"))

    @staticmethod
    # @authenticated_only
    def on_disconnect():
        print('客户端断开连接')
        leave_room('chat')

    @staticmethod
    # @authenticated_only
    def on_send_message(data):
        # 这里可以使用 session 来获取当前用户的信息
        print(f'客户端接收到消息:[{data}]', session.get("user_id"), current_user)

        m = Message(dict(
            user_id=current_user.id,
            msg=data.get('msg', ''),
        ))
        m.save()
        d = dict(
            user_id=u.id,
            username=u.username,
            msg=m.msg,
            msg_id=m.id,
        )
        # 发送消息到前端，前端使用 socket.on('receive_message', function(data){}) 来接收消息
        emit('receive_message', d, room='chat')
