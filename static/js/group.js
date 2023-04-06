const groupTemplate = (form) => {
    let t = `
        <div class="msg-group-name" data-id=${form.id}>${form.name}</div>
    `
    return t
}

const insertGroup = (form) => {
    let msg_cell = groupTemplate(form)
    var msg_list = e('.msg-group')
    appendHtml(msg_list, msg_cell)
}

class GroupButton extends GuaObject {
    static element = 'button-group-add'
    static elementSel = e(`.${this.element}`)
    static input = 'input-group-add'
    static inputSel = e(`.${this.input}`)

    static showInput() {
        let inputSel = GroupButton.inputSel
        inputSel.className += ' input-display'
        //
        inputSel.addEventListener("keyup", function (event) {
            let content = inputSel.value
            if (event.keyCode === 13 && content.length > 1) {
                inputSel.className = GroupButton.input
                inputSel.value = ''
                let form = {
                    name: content,
                }
                API.call(Method.Post, '/group/add', form, function(r){
                    let response = JSON.parse(r)
                    log('新增群成功', response)
                    form['id'] = response.id
                    insertGroup(form)
                })
            }
        })
    }
}

class ActionGroup extends Action {
    static eventActions = {
        'click': {
            'showInput': GroupButton.showInput,
        },
    }
}