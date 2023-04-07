from models import Model


class Room(Model):
    """
    房间名
    """
    def __init__(self, form):
        self.id = form.get('id', None)
        self.name = form.get('name', '')
        # -1 表示系统默认
        self.create_user_id = form.get('user_id', -1)


class RoomMembers(Model):
    """
    房间里的成员
    """
    def __init__(self, form):
        self.id = form.get('id', None)
        self.room_id = form.get('room_id', '')
        self.user_id = form.get('user_id', '')
