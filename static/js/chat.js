class Msg extends GuaObject {
    constructor(form) {
        super()
        let username = form.username
        let user_id = form.user_id
        let msg = form.msg
        let msg_id = form.msg_id
        return {
            username: username,
            user_id: user_id,
            msg: msg,
            msg_id: msg_id,
        }
    }
}

// class MsgContainer extends GuaObject {
//     static container = 'id-div-msg-container'
//     static containerSel = e(`#${this.container}`)
//
//     static addMsg(msg) {
//         // 添加一个 msg 到页面中
//         let container = this.containerSel
//         let t = `
//             <div class="gua-message">
//                 <img class="gua-message-avatar" src="${msg.avatar}">
//                 <span class="gua-message-content">${msg.username} 【说】</span>
//                 <span class="gua-message-content">${msg.content}</span>
//             </div>
//         `
//         appendHtml(container, t)
//     }
// }

class SocketIO {
    constructor() {
        log('socketio init')
        // 这里的 /chat 就是我们在 server_socket.py 中定义的 namespace
        return io('http://127.0.0.1:5000/chat')
        // return io('/chat')
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
            let form = {
                msg: content,
            }
            SocketIO.send('send_message', form)
            input.value = ''
        }
    }
}

class ActionChat extends Action {
    static eventActions = {
        'keyup': {
            'send': Chat.send,
        },
    }
}

const msgScrollTop = () => {
    // 保持聊天记录为最新
    let msg_list = e('.msg-list')
    msg_list.scrollTop = msg_list.scrollHeight
}

const __main = function() {
    // https://socket.io/docs/v4/client-options/#auth
    // https://flask-socketio.readthedocs.io/en/latest/getting_started.html#connection-events
    msgScrollTop()
    SocketIO.bindMessageEvent()
    ActionChat.bindEvent()
}

__main()
