var initialState = {
    pocket: {
        loading: true
    },
    instapaper: {
        loading: true
    }
}

export default function IntegrationsReducer(state = initialState, action) {
    switch (action.type) {
        case "LOADED_INTEGRATIONS":
            return Object.assign({}, state, {
                pocket: {
                    loading: false,
                    integrated: action.integrations.pocket.signed_in
                },
                instapaper: {
                    loading: false,
                    integrated: action.integrations.instapaper.signed_in
                }, 
            })
        case "POCKET_CHANGED":
            return Object.assign({}, state, {
                pocket: {
                    loading: false,
                    integrated: action.inegrated,
                },
                instapaper: state.instapaper,
            })
        case "INSTAPAPER_CHANGED":
            return Object.assign({}, state, {
                instapaper: {
                    loading: false,
                    integrated: action.integrated,
                },
                pocket: state.pocket,
            })
        default:
            return state
    }
}
