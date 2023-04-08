from models import Model
from utils import log


class Message(Model):
    """
    User 是一个保存用户数据的 model
    现在只有两个属性 username 和 password
    """

    def __init__(self, form):
        self.id = form.get('id', None)
        self.msg = form.get('msg', '')
        self.room_id = form.get('room_id', None)
        self.user_id = form.get('user_id', None)


class ReadRecord(Model):
    """
    记录离开房间后读取的最后一条消息
    """

    def __init__(self, form):
        self.id = form.get('id', None)
        self.msg_id = form.get('msg_id', '')
        self.room_id = form.get('room_id', None)
        self.user_id = form.get('user_id', None)

    @classmethod
    def read(cls, user_id, room_id):
        msg_list = Message.find_all(room_id=room_id)
        if len(msg_list) == 0:
            msg_id = -1
        else:
            msg_id = msg_list[-1].id
        r = ReadRecord.find_by(user_id=user_id, room_id=room_id)
        if r is None:
            form = dict(
                msg_id=msg_id,
                room_id=room_id,
                user_id=user_id,
            )
            log('read', form)
            record = cls(form)
            record.save()
        else:
            r.msg_id = msg_id
            r.save()
