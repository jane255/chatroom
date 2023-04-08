import typing as t

from models import Model
from utils import log


class Room(Model):
    """
    房间名
    """

    def __init__(self, form):
        self.id = form.get('id', None)
        self.name = form.get('name', '')
        # -1 表示系统默认
        self.create_user_id = form.get('user_id', -1)


# class RoomMembers(Model):
#     """
#     房间里的成员
#     """
#     def __init__(self, form):
#         self.id = form.get('id', None)
#         self.room_id = form.get('room_id', '')
#         self.user_id = form.get('user_id', '')


class RoomMembers:

    def __init__(self):
        # 初始化一个字典存放每个房间里的当前在线所有用户
        self.room_members_dict: t.Dict[str, set] = {}
        self.member_for_room: t.Dict[str, str] = {}

    @staticmethod
    def room(room_id):
        return f'房间{str(room_id)}'

    @staticmethod
    def parse_room_id(room):
        return int(room.split('房间')[-1])

    def add_room(self, room_id):
        room = self.room(room_id)
        self.room_members_dict[room] = set()

    def add_member(self, room_id, user_id):
        # log("add_member", room_id, user_id)
        room = self.room(room_id)
        #
        if room not in self.room_members_dict:
            self.add_room(room_id)
        self.room_members_dict[room].add(user_id)
        self.member_for_room[str(user_id)] = room

    def members_from_room_id(self, room_id):
        room = self.room(room_id)
        return list(self.room_members_dict.get(room, []))

    def leave_room(self, user_id):
        room = self.member_for_room.pop(str(user_id))
        log(f"leave_room, user_id:{user_id}, room:{room}")
        self.room_members_dict[room].remove(user_id)
        return self.parse_room_id(room)

    def room_id_from_user(self, user_id):
        room = self.member_for_room.get(str(user_id))
        return self.parse_room_id(room)


room_members_dict = RoomMembers()
