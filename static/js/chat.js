class Msg extends GuaObject {
    constructor(form) {
        super()
        let username = form.username
        let avatar = form.avatar
        let content = form.content
        return {
            username: username,
            avatar: avatar,
            content: content,
        }
    }
}

class MsgContainer extends GuaObject {
    static container = 'id-div-msg-container'
    static containerSel = e(`#${this.container}`)

    static addMsg(msg) {
        // 添加一个 msg 到页面中
        let container = this.containerSel
        let t = `
            <div class="gua-message">
                <img class="gua-message-avatar" src="${msg.avatar}">
                <span class="gua-message-content">${msg.username} 【说】</span>
                <span class="gua-message-content">${msg.content}</span>
            </div>
        `
        appendHtml(container, t)
    }
}

const randomAvatar = () => {
    // 获取 img/avatar 目录下的所有图片名
    let images = [
        'Nintendo_Switch_Princess_Zelda_TWWHD_Icon.png',
        'Nintendo_Switch_Urbosa_Icon.png',
        'Nintendo_Switch_Daruk_Icon.png',
        'Nintendo_Switch_Revali_Icon.png',
        'Nintendo_Switch_Guardian_Icon.png',
        'Nintendo_Switch_Master_Sword_Hylian_Shield_Icon.png',
        'Nintendo_Switch_Link_Series_Icon.png',
        'Nintendo_Switch_Link_BotW_Icon.png',
        'Nintendo_Switch_Wingcrest_Icon.png',
        'Nintendo_Switch_Bokoblin_Icon.png',
        'Nintendo_Switch_Daruk_Icon-1.png',
        'Nintendo_Switch_Zelda_BotW_Icon.png',
        'Nintendo_Switch_Ganondorf_TWWHD_Icon.png',
        'Nintendo_Switch_funny.png',
        'Nintendo_Switch_Mipha_Icon.png',
        'Nintendo_Switch_Link_TWWHD_Icon.png',
        'Nintendo_Switch_Ganondorf_TPHD_Icon.png',
        'Nintendo_Switch_Princess_Zelda_TPHD_Icon.png',
        'Nintendo_Switch_Kass_Icon.png',
        'Nintendo_Switch_Link_TP_Icon.png',
    ]
    let index = Math.floor(Math.random() * images.length)
    let name = images[index]
    return `../static/img/avator/${name}`
}

class SocketIO {
    constructor() {
        log('socketio init')
        // 这里的 /chat 就是我们在 server_socket.py 中定义的 namespace
        return io('http://127.0.0.1:5000/chat')
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
            MsgContainer.addMsg(msg)
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
    static input = 'id-input-msg'
    static inputSel = e(`#${this.input}`)

    static send() {
        let input = Chat.inputSel
        let content = input.value
        let form = {
            content: content,
            avatar: randomAvatar(),
        }
        SocketIO.send('send_message', form)
    }
}

class ActionChat extends Action {
    static eventActions = {
        'click': {
            'send': Chat.send,
        },
    }
}

// const __main = () => {
//     // 设置聊天记录在最底部
//     msgScrollTop()
//     //
//     ActionChat.bindEvent()
//     SocketIO.bindMessageEvent()
// }
//
//
// __main()
