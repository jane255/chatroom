class Msg extends GuaObject {
    constructor(form) {
        super()
        let username = form.username
        let user_id = form.user_id
        let msg = form.msg
        let msg_id = form.msg_id
        let avatar = form.avatar
        return {
            username: username,
            user_id: user_id,
            msg: msg,
            msg_id: msg_id,
            avatar: avatar,
        }
    }
}

class SocketIO {
    constructor() {
        log('socketio init --------------------------')
        // 这里的 /chat 就是我们在 server_socket.py 中定义的 namespace
        let socket = io('http://localhost:5000/chat')

        socket.on('connect', function() {
            let room_id = e('.msg-body').dataset.id
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
            // MsgContainer.addMsg(msg)
            insertMsg(msg)
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
            let room_id = e('.msg-body').dataset.id
            let form = {
                msg: content,
                room_id: room_id,
            }
            SocketIO.send('send_message', form)
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

