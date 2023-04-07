from models import Model


class Message(Model):
    """
    User 是一个保存用户数据的 model
    现在只有两个属性 username 和 password
    """
    def __init__(self, form):
        self.id = form.get('id', None)
        self.msg = form.get('msg', '')
        self.room_id = form.get('room_id', '')
        self.user_id = form.get('user_id', '')
