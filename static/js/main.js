const __main = function() {
    // https://socket.io/docs/v4/client-options/#auth
    // https://flask-socketio.readthedocs.io/en/latest/getting_started.html#connection-events

    MsgContainer.msgScrollTop()
    SocketIO.bindMessageEvent()
    SocketIO.bindJoinEvent()
    SocketIO.bindLeaveEvent()
    SocketIO.bindDisconnectEvent()
    ActionChat.bindEvent()
    ActionRoom.bindEvent()
    Room.clickRoom()
}

__main()
