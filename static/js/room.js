class Room extends GuaObject {
    constructor(form) {
        super()
        let id = form.room_id
        let name = form.name
        return {
            name: name,
            id: id,
        }
    }
}

class RoomAction {
    static Join = 'join'
    static Leave = 'leave'
}

class RoomContainer extends GuaObject {
    static container = 'msg-room-list'
    static containerSel = e(`.${this.container}`)
    //
    static input = 'add-room-input'
    static inputSel = e(`.${this.input}`)

    static addRoom(instance) {
        // 添加一个 msg 到页面中
        let container = this.containerSel
        let t = this.roomTemplate(instance)
        appendHtml(container, t)
        //
    }

    static roomTemplate = (instance) => {
        let t = `
            <div class="msg-room-name div-room-${instance.id}" data-id=${instance.id}>${instance.name}</div>
        `
        return t
    }

    static clickRoom = () => {
        let containerSel = this.containerSel
        let _this = this
        containerSel.addEventListener('click', function(event){
            let self = event.target
            if (self.classList.contains('msg-room-name')){
                let room = Room.new({
                    room_id: parseInt(self.dataset.id),
                    name: self.innerText
                })
                log("点击到了切换房间", room)
                // 调整当前房间标识
                _this.changeCurrentRoom(room)
                // //
                // let form = {
                //     room_id: parseInt(room_id),
                // }
                // API.call(Method.Post, '/chat/detail', form, function(r){
                //     let response = JSON.parse(r)
                //     log('请求聊天消息', response)
                //     updateRoom(response.data)
                // })
            }
        })
    }

    // 更改当前房间标识
    static changeCurrentRoom = (room) => {
        let body = e('.msg-body')
        let current_room_id = body.dataset.room_id
        // 更改当前房间 id
        body.dataset.room_id = room.id
        this.updateCurrentRoomClass(room)
    }

    // 调整当前房间标识
    static updateCurrentRoomClass = (room) => {
        let s = 'current-room'
        let current_room = e(`.${s}`)
        current_room.className = current_room.className.split(s).join("")
        //
        let element = e(`.div-room-${room.id}`)
        element.className += ' current-room'
    }

    static bindButton = () => {
        this.showInput()
        let inputSel = this.inputSel
        let _this = this
        //
        inputSel.addEventListener("keyup", function (event) {
            let content = inputSel.value
            log("content", content)
            if (event.keyCode === 13 && content.length > 1) {
                _this.hideInput()
                let form = {
                    name: content,
                }
                _this.createRoom(form)
            }
        })
    }

    static showInput = () => {
        let inputSel = this.inputSel
        inputSel.className += ' input-display'
    }

    static hideInput = () => {
        let inputSel = this.inputSel
        inputSel.className = this.input
        inputSel.value = ''
    }

    static createRoom = (form) => {
        let _this = this
        API.call(Method.Post, '/room/add', form, function(r){
            let response = JSON.parse(r)
            let room = Room.new(response.data)
            log('新增群成功', room)
            // // 新增群的同时、当前用户加入该群
            // // 其他用户只能在刷新页面出现新群的情况下，点击该群并加入该群
            _this.addRoom(room)
            _this.changeCurrentRoom(room)
            // joinRoom(form)
        })
    }

    static join = (user) => {
        MemberContainer.addMember(user)
        MsgContainer.addNotice(user, RoomAction.Join)
    }

    static leave = (user) => {
        MemberContainer.removeMember(user)
        MsgContainer.addNotice(user, RoomAction.Leave)
    }
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
    // let body = e('.msg-body')
    // let current_room_id = parseInt(body.dataset.room_id)
    // // 更改当前房间 id
    // body.dataset.room_id = form.room_id
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
        addMsg(arrayElement)
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

class ActionRoom extends Action {
    static eventActions = {
        'click': {
            'showInput': RoomContainer.bindButton,
        },
    }
}