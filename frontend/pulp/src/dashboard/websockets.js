export function connectToWebSocket(dispatch) {
    return new Promise(function (resolve, reject) {
        const progressSocket = new WebSocket("ws://" + window.location.host + "/ws/api/progress/")

        progressSocket.onopen = () => resolve(progressSocket)
        progressSocket.onerror = (err) => reject(err)

        progressSocket.onmessage = onMessage(dispatch)
    })
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
