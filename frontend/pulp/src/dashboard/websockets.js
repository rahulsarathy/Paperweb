export function createWebSocket(dispatch) {
    let progressSocket = new WebSocket("ws://" + window.location.host + "/ws/api/progress/")

    progressSocket.onmessage = onMessage(dispatch)

    return progressSocket
}

function onMessage(dispatch) {
    return function(message) {
        console.log(message)
        let data = JSON.parse(message.data)

        switch (data.job_type) {
            default:
                return
        }
    }
}
