import { combineReducers, reduceReducers } from "redux"
import { reducer as integrationReducer } from './components/Integrations/redux'
import { reducer as readingListReducer } from './components/ReadingListView/redux'
import { reducer as userReducer } from './components/SettingsView/redux'
import { reducer as websocketReducer } from './websockets'

var rootReducer = combineReducers({
    user: userReducer,
    readingList: readingListReducer,
    integrations: integrationReducer,
    websockets: websocketReducer,
})

export default rootReducer
