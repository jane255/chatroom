const roomTemplate = (form) => {
    let t = `
        <div class="msg-room-name current-room" data-id=${form.room_id}>${form.name}</div>
    `
    return t
}

const insertRoom = (form) => {
    // 更改当前房间标识
    let current_room = e('.current-room')
    current_room.className = 'msg-room-name'
    // 插入房间标签
    let msg_cell = roomTemplate(form)
    var msg_list = e('.msg-room')
    appendHtml(msg_list, msg_cell)
}

const joinRoom = (form) => {
    let body = e('.msg-body')
    let current_room_id = parseInt(body.dataset.room_id)
    // 更改当前房间 id
    body.dataset.room_id = form.room_id
    // 离开原来的房间
    // 1，其他人的群成员里删了我
    // 2，我的群成员里只有我
    let socket = SocketIO.instance()
    socket.emit("leave_room", current_room_id)
    // 加入房间
    socket.emit("join_room", form.room_id)
    // 更改当前聊天 title
    let title = e('#id-title')
    title.innerText = form.name
    // 删除所有聊天记录
    let msg_me = es('.msg-cell-me')
    for (let msgMeKey of msg_me) {
        msgMeKey.remove()
    }
    let msg_you = es('.msg-cell-you')
    for (let msgMeKey of msg_you) {
        msgMeKey.remove()
    }
}

class RoomButton extends GuaObject {
    static element = 'add-room-button'
    static elementSel = e(`.${this.element}`)
    static input = 'add-room-input'
    static inputSel = e(`.${this.input}`)

    static showInput() {
        let inputSel = RoomButton.inputSel
        inputSel.className += ' input-display'
        //
        inputSel.addEventListener("keyup", function (event) {
            let content = inputSel.value
            if (event.keyCode === 13 && content.length > 1) {
                inputSel.className = RoomButton.input
                inputSel.value = ''
                let form = {
                    name: content,
                }
                API.call(Method.Post, '/room/add', form, function(r){
                    let response = JSON.parse(r)
                    log('新增群成功', response)
                    // 新增群的同时、当前用户加入该群
                    // 其他用户只能在刷新页面出现新群的情况下，点击该群并加入该群
                    form['room_id'] = response.data.room_id
                    insertRoom(form)
                    joinRoom(form)
                })
            }
        })
    }
}

class ActionRoom extends Action {
    static eventActions = {
        'click': {
            'showInput': RoomButton.showInput,
        },
    }
}