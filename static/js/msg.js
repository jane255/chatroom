const msgTemplate = (msg_body) => {
    var msg_list = e('.msg-list')
    var user_id = parseInt(msg_list.dataset.user_id)
    if (msg_body.user_id === user_id) {
        let t = `
        <div class="msg-cell-me">
            <div class="msg-cell-me-username">我</div>
            <span id='msg-cell-me-msg' class='msg-cell-msg'  data-msg_id={{m.id}}>
                ${msg_body.msg}
            </span>
        </div>
    `
        return t
    } else {
        let t = `
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

const insertMsg = (msg_body) => {
    let msg_cell = msgTemplate(msg_body)
    appendHtml('.msg-list', msg_cell)
    // msg_list.scrollTop = msg_list.scrollHeight
}