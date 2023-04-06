const msgTemplate = (msg_body) => {
    let msg_list = e('.msg-list')
    let user_id = parseInt(msg_list.dataset.user_id)

    //
    if (msg_body.user_id === user_id) {
        let t = `
        <div class="msg-cell-me">
            <div class="msg-cell-body">
                <div class="msg-cell-me-username">
                    我
                </div>
                <div id="msg-cell-me-msg" class='msg-cell-msg' data-msg_id=${msg_body.id}>
                    ${msg_body.msg}
                </div>
            </div>
            <div class="msg-cell-avatar">
                <img class="msg-cell-avatar-img" src="/static/img/avatar/${msg_body.avatar}">
            </div>
        </div>
    `
        return t
    } else {
        let t = `
        <div class="msg-cell-you">
            <div class="msg-cell-avatar">
                <img class="msg-cell-avatar-img" src="/static/img/avatar/${msg_body.avatar}">
            </div>
            <div class="msg-cell-body">
                <div class="msg-cell-you-username">
                    ${msg_body.username}
                </div>
                <div id="msg-cell-you-msg" class='msg-cell-msg' data-msg_id=${msg_body.id}>
                    ${msg_body.msg}
                </div>
            </div>
        </div>
    `
        return t
    }
}

const insertMsg = (msg_body) => {
    let msg_cell = msgTemplate(msg_body)
    var msg_list = e('.msg-list')
    appendHtml(msg_list, msg_cell)
    msg_list.scrollTop = msg_list.scrollHeight
}

const msgScrollTop = () => {
    // 保持聊天记录为最新
    let msg_list = e('.msg-list')
    msg_list.scrollTop = msg_list.scrollHeight
}