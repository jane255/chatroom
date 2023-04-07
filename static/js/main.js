const __main = function() {
    // https://socket.io/docs/v4/client-options/#auth
    // https://flask-socketio.readthedocs.io/en/latest/getting_started.html#connection-events
    msgScrollTop()
    SocketIO.bindMessageEvent()
    ActionChat.bindEvent()
    ActionRoom.bindEvent()
}

__main()
