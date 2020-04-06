var initialState = {
    loadingEmail: true,
    loadingSubscription: true,
}

export default function UserReducer(state = initialState, action) {
    switch (action.type) {
        case "LOADED_EMAIL":
            return Object.assign({}, state, {
                loadingEmail: false,
                email: action.email
            })
        case "LOADED_SUBSCRIPTION":
            return Object.assign({}, state, {
                loadingSubscription: false,
                subscribed: action.subscribed
            })
        default:
            return state
    }
}
