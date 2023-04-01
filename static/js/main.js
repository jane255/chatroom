var msgTemplate = function(msg_body) {
    var msg_list = e('.msg-list')
    var user_id = parseInt(msg_list.dataset.user_id)
    if (msg_body.user_id === user_id) {
        var t = `
        <div class="msg-cell-me">
            <div class="msg-cell-me-username">我</div>
            <span id='msg-cell-me-msg' class='msg-cell-msg'  data-msg_id={{m.id}}>
                ${msg_body.msg}
            </span>
        </div>
    `
        return t
    } else {
        var t = `
        <div class="msg-cell-you">
            <div class="msg-cell-you-username">${msg_body.username}</div>
            <div id="msg-cell-you-msg" class='msg-cell-msg' data-msg_id={{m.id}}>
                ${msg_body.msg}
            </span>
        </div>
    `
        return t
    }
}

var insertMsg = function(msg_body) {
    var msg_cell = msgTemplate(msg_body)
    // 插入 msg-list
    var msg_list = e('.msg-list')
    msg_list.insertAdjacentHTML('beforeend', msg_cell)
    msg_list.scrollTop = msg_list.scrollHeight
}


var bindInput = function () {
    var input = e("#id-input")
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            var value = input.value
            input.value = ''
            log("按下了回车", value)
            socket.emit('message', {msg: value}, function () {

            })
        }
    })
}


var bindMsgList = function () {
    socket.on('msg_list', function (msg_body) {
        // 连接成功后 向服务端发送 my event 事件
        log("bindMsgList response", msg_body)
        insertMsg(msg_body)
    })
}


const socket = io()


const connectSocket = function() {
    // var socket = io('http://127.0.0.1:5000')
    socket.on('connect', function () {
        // 连接成功后 向服务端发送 my event 事件
        // socket.emit('my event', {data: "hello"})
        log("connect", socket.id)
    })
}


const msgScrollTop = () => {
    let msg_list = e('.msg-list')
    msg_list.scrollTop = msg_list.scrollHeight
}

const __main = function() {
    // https://socket.io/docs/v4/client-options/#auth
    // https://flask-socketio.readthedocs.io/en/latest/getting_started.html#connection-events
    connectSocket()
    bindInput()
    bindMsgList()
    msgScrollTop()
}

__main()