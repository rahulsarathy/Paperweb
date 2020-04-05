import { combineReducers } from "redux"
import { reducer as integrationReducer } from './components/Integrations/redux'
import { reducer as readingListReducer } from './components/ReadingListView/redux'
import { reducer as userReducer } from './components/SettingsView/redux'

var rootReducer = combineReducers({
    user: userReducer,
    readingList: readingListReducer,
    integrations: integrationReducer,
})

export default rootReducer