var initialState = {
    percent: -1
}

export default function LoadingBarReducer(state = initialState, action) {
    switch (action.type) {
        case "LOADING_SET_PERCENT":
            return Object.assign({}, state, {
                percent: action.percent
            })
        case "LOADING_CLEAR":
            return Object.assign({}, state, {
                percent: -1
            })
        default:
            return state
    }
}