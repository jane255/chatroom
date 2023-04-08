// 用户离开，分两步
// 1，如果是我离开，那么应该删除所有群成员
// 2，如果是成员离开，那么应该是只删除该成员
const deleteAllMember = (form) => {
    let current_user_id = e('.msg-box').dataset.user_id
    if (form.user_id == parseInt(current_user_id)) {
        let msg_list = es('.msg-member-cell')
        for (let msgListElement of msg_list) {
            msgListElement.remove()
        }
    } else {
        deleteDisconnectMember(form)
    }
}

class SocketIO {
    constructor() {
        log('socketio init --------------------------')
        // 这里的 /chat 就是我们在 server_socket.py 中定义的 namespace
        let socket = io('http://localhost:5000/chat')

        socket.on('connect', function() {
            let room_id = e('.msg-body').dataset.room_id
            log(`加入房间号(${room_id})`)
            socket.emit("join_room", room_id)
        })
        return socket
    }

    static instance(...args) {
        this.i = this.i || new this(...args)
        return this.i
    }

    static bindMessageEvent() {
        let socket = this.instance()
        // 接收服务端发送的 receive_message 事件
        // 并且调用 MsgContainer.addMsg 来添加消息
        socket.on('receive_message', function (resp) {
            let msg = Msg.new(resp)
            log("receive_message", msg)
            MsgContainer.addMsg(msg)
        })
    }

    static bindJoinEvent() {
        let socket = this.instance()
        // 接收服务端发送的 receive_message 事件
        // 并且调用 MsgContainer.addMsg 来添加消息
        socket.on('receive_join', function (resp) {
            let member = User.new(resp)
            log("receive_join", member)
            MemberContainer.addMember(member)
        })
    }

    static bindLeaveEvent() {
        let socket = this.instance()
        // 接收服务端发送的 receive_message 事件
        // 并且调用 MsgContainer.addMsg 来添加消息
        socket.on('receive_leave', function (resp) {
            let member = User.new(resp)
            log("receive_leave", member)
            deleteAllMember(resp)
        })
    }

    static bindDisconnectEvent() {
        let socket = this.instance()
        // 接收服务端发送的 receive_message 事件
        // 并且调用 MsgContainer.addMsg 来添加消息
        socket.on('receive_disconnect', function (resp) {
            let member = User.new(resp)
            log("receive_disconnect", member)
            MemberContainer.removeMember(member)
        })
    }

    static send(event, form) {
        // event 是事件名字
        // 响应的函数是 ChatRoomNamespace.on_{event}
        // 在我们的使用场景中，event 就是 send_message
        let socket = this.instance()
        socket.emit(event, form)
    }
}

class Chat extends GuaObject {
    static input = 'id-input'
    static inputSel = e(`#${this.input}`)

    static send() {
        let input = Chat.inputSel
        let content = input.value
        if (content.endsWith("\n")) {
            content = content.substring(0, content.length - 1)
            let form = {
                msg: content,
            }
            SocketIO.send('send_message', form)
            // 清空输入
            input.value = ''
        }
    }
}

class ActionChat extends Action {
    static eventActions = {
        'keyup': {
            'msg-send': Chat.send,
        },
    }
}

