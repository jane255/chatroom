const roomTemplate = (form) => {
    let t = `
        <div class="msg-room-name" data-id=${form.id}>${form.name}</div>
    `
    return t
}

const insertRoom = (form) => {
    let msg_cell = roomTemplate(form)
    var msg_list = e('.msg-room')
    appendHtml(msg_list, msg_cell)
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
                    form['id'] = response.id
                    insertRoom(form)
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