import time

from flask_socketio import Namespace, leave_room
from flask_socketio import emit
from flask_socketio import join_room

from models.msg import Message
from models.room import Room, room_members_dict
from routes import current_user, login_required
from utils import log


class ChatRoomNamespace(Namespace):

    @staticmethod
    def init():
        room_list = Room.all()
        if len(room_list) == 0:
            log("初始化默认房间")
            g = Room(dict(name='chat'))
            g.save()
            room_members_dict.add_room(g.id)

    @staticmethod
    @login_required
    def on_connect():
        print('客户端连接')

    @staticmethod
    @login_required
    def on_join_room(room_id):
        u = current_user()
        print(f'{u.username} 加入房间:({room_id})')
        # 加入房间
        room: Room = Room.find(int(room_id))
        join_room(room.name)
        #
        room_members_dict.add_member(room_id=room.id, user_id=u.id)
        #
        result = dict(
            avatar=u.avatar,
            username=u.username,
            user_id=u.id,
            room_id=room.id,
        )
        emit('receive_join', result, room=room.name)

    @staticmethod
    @login_required
    def on_leave_room():
        u = current_user()
        # 离开房间
        room_id = room_members_dict.leave_room(u.id)
        print(f'({u.username})离开房间{room_id}')
        room = Room.find(room_id)
        # 通知离线
        form = dict(
            user_id=u.id,
            username=u.username,
        )
        emit('receive_leave', form, room=room.name)
        leave_room(room.name)

    @staticmethod
    @login_required
    def on_disconnect():
        print('客户端断开连接', )
        # 断开缓存
        u = current_user()
        room_id = room_members_dict.leave_room(u.id)
        # 离开房间
        room = Room.find(room_id)
        leave_room(room.name)
        # 通知离线
        form = dict(
            user_id=u.id,
            username=u.username,
        )
        emit('receive_disconnect', form, room=room.name)

    @staticmethod
    @login_required
    def on_send_message(data):
        # 这里可以使用 session 来获取当前用户的信息
        print(f'客户端接收到消息:[{data}]')

        current = current_user()
        room_id = room_members_dict.room_id_from_user(current.id)
        room = Room.find(room_id)
        m = Message(dict(
            user_id=current.id,
            msg=data.get('msg', ''),
            room_id=room.id,
        ))
        m.save()
        d = dict(
            user_id=current.id,
            username=current.username,
            avatar=current.avatar,
            msg=m.msg,
            msg_id=m.id,
        )
        # 发送消息到前端，前端使用 socket.on('receive_message', function(data){}) 来接收消息
        emit('receive_message', d, room=room.name)


# 注册一个命名空间
chat_room_namespace = ChatRoomNamespace('/chat')
chat_room_namespace.init()
