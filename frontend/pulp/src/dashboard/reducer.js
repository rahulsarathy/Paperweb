import { combineReducers } from "redux"
import IntegrationsReducer from './reducers/IntegrationsReducer'
import ReadingListReducer from './reducers/ReadingListReducer'
import UserReducer from './reducers/UserReducer'
import SettingsReducer from './reducers/SettingsReducer'
import LoadingBarReducer from './reducers/LoadingBarReducer'
import { reducer as websocketReducer } from './websockets'

var rootReducer = combineReducers({
    user: UserReducer,
    settings: SettingsReducer,
    readingList: ReadingListReducer,
    integrations: IntegrationsReducer,
    loading: LoadingBarReducer,
})

export default rootReducer
