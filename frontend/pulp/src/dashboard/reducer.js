import { combineReducers } from "redux"
import { reducer as integrationReducer } from './components/Integrations/redux'
import { reducer as readingListReducer } from './components/ReadingListView/redux'

var initialState = {
    loadingEmail: true,
    loadingSubscription: true,
}

function userReducer(state = initialState, action) {
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

var rootReducer = combineReducers({
    user: userReducer,
    readingList: readingListReducer,
    integrations: integrationReducer,
})

export default rootReducer