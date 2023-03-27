var log = function() {
    console.log.apply(console, arguments)
}

var e = function(sel) {
    return document.querySelector(sel)
}

var msgTemplate = function(msg_body) {
    var msg_list = e('.msg-list')
    var user_id = parseInt(msg_list.dataset.user_id)
    if (msg_body.user_id === user_id) {
        var t = `
        <div class="msg-cell" style="text-align: right">
            <div style="font-size: 15px; color: #a0abcb; padding: 5px">我</div>
            <span class='msg' style="border-width: 5px; padding-top: 5px; padding-bottom: 5px; padding-left: 15px; padding-right: 15px;  width: 150px; height: 30px ; background-color: rgb(237 222 240);border-radius: 5px;">
                ${msg_body.msg}
            </span>
        </div>
    `
        return t
    } else {
        var t = `
        <div class="msg-cell">
            <div style="font-size: 18px; color: #a0abcb; padding: 5px">${msg_body.username}</div>
            <span class='msg' style="border-width: 3px ;padding-left: 15px; padding-right: 15px;  padding-top: 5px; padding-bottom: 5px; width: 150px; height: 30px ; background-color: rgb(218 245 253);border-radius: 5px;">
                ${msg_body.msg}
            </span>
        </div>
    `
        return t
    }
    /*
    上面的写法在 python 中是这样的
    t = """
    <div class="todo-cell">
        <button class="todo-delete">删除</button>
        <span>{}</span>
    </div>
    """.format(todo)
    */
}

var insertMsg = function(msg_body) {
    var msg_cell = msgTemplate(msg_body)
    // 插入 msg-list
    var msg_list = e('.msg-list')
    msg_list.insertAdjacentHTML('beforeend', msg_cell)
}


var bindInput = function () {
    var input = e("#id-input")
    input.addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
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


var connectSocket = function() {
    // var socket = io('http://127.0.0.1:5000')
    socket.on('connect', function () {
        // 连接成功后 向服务端发送 my event 事件
        // socket.emit('my event', {data: "hello"})
        log("connect", socket.id)
    })
}

var __main = function() {
    // https://socket.io/docs/v4/client-options/#auth
    // https://flask-socketio.readthedocs.io/en/latest/getting_started.html#connection-events
    connectSocket()
    bindInput()
    bindMsgList()
}

__main()