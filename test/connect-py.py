import socketio
import time


def test_ws_connect():
    sio = socketio.Client()
    sio.connect('http://127.0.0.1:5000')
    sio.emit('test', 'message from connect-py')
    time.sleep(1)
    sio.disconnect()


if __name__ == '__main__':
    test_ws_connect()
