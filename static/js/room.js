const roomTemplate = (form) => {
    let t = `
        <div class="msg-room-name current-room" data-id=${form.room_id}>${form.name}</div>
    `
    return t
}

// 更改当前房间标识
const deleteCurrentRoom = () => {
    let current_room = e('.current-room')
    current_room.className = 'msg-room-name'
}

const insertRoom = (form) => {
    // 更改当前房间标识
    deleteCurrentRoom()
    // let current_room = e('.current-room')
    // current_room.className = 'msg-room-name'
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

const updateMsgList = (array) => {
    for (let arrayElement of array) {
        insertMsg(arrayElement)
    }
}

const updateMember = (array) => {
    for (let arrayElement of array) {
        insertMember(arrayElement)
    }
}

const updateRoom = (form) => {
    let room = form.room

    let body = e('.msg-body')
    let current_room_id = parseInt(body.dataset.room_id)
    // 更改当前房间 id
    body.dataset.room_id = room.id
    // 离开原来的房间
    // 1，其他人的群成员里删了我
    // 2，我的群成员里只有我
    let socket = SocketIO.instance()
    socket.emit("leave_room", current_room_id)
    // 加入房间
    socket.emit("join_room", room.id)
    // 更改当前聊天 title
    let title = e('#id-title')
    title.innerText = room.name
    // 删除所有聊天记录
    let msg_me = es('.msg-cell-me')
    for (let msgMeKey of msg_me) {
        msgMeKey.remove()
    }
    let msg_you = es('.msg-cell-you')
    for (let msgMeKey of msg_you) {
        msgMeKey.remove()
    }
    // 更新聊天记录
    updateMsgList(form.msg_list)
    // 更新群成员
    updateMember(form.member_list)
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

class Room extends GuaObject {
    static element = 'msg-room'
    static elementSel = e(`.${this.element}`)

    static clickRoom() {
        let elementSel = Room.elementSel
        elementSel.addEventListener('click', function(event){
            var self = event.target
            if (self.classList.contains('msg-room-name')){
                let room_id = self.dataset.id
                log("点击到了切换房间", room_id)
                // 调整当前房间标识
                deleteCurrentRoom()
                self.className += ' current-room'
                //
                let form = {
                    room_id: parseInt(room_id),
                }
                API.call(Method.Post, '/chat/detail', form, function(r){
                    let response = JSON.parse(r)
                    log('请求聊天消息', response)
                    updateRoom(response.data)
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