var initialState = {
    loading: []
}

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
            case "add_to_reading_list":
                dispatch({ type: "UPDATE_ARTICLE_PERCENTAGE", url: data.link, percent: data.percent })
                return
            default:
                return
        }
    }
}
export function reducer(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_ARTICLE_PERCENTAGE":
            if (action.percent === 100) {
                return Object.assign({}, state, {
                    loading: state.loading.filter((item) => item.url !== action.url)
                })
            } else if (action.percent === 0) {
                return Object.assign({}, state, {
                    loading: [...state.loading, { url: action.url, percent: action.percent }]
                })
            } else {
                return Object.assign({}, state, {
                    loading: state.loading.map((item) => {
                        if (item.url === action.url) {
                            return Object.assign({}, item, {
                                percent: action.percent
                            })
                        } else {
                            return item
                        }
                    })
                })
            }
        default:
            return state;
    }
}