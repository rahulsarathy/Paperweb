var initialState = {
    loading: true,
    address: {
        loading: true,
    }
}

export default function SettingsReducer(state = initialState, action) {
    switch (action.type) {
        case "LOADED_SETTINGS":
            return {
                loading: false,
                address: state.address,
                ...action.settings
            }
        case "LOADED_ADDRESS":
            return {
                ...state,
                address: action.address,
            }
        case "CHANGE_SETTING":
            return {
                ...state,
                [action.key]: action.value
            }
        default:
            return state
    }
}