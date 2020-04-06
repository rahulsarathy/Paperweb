import { combineReducers } from "redux"
import IntegrationsReducer from './reducers/IntegrationsReducer'
import ReadingListReducer from './reducers/ReadingListReducer'
import UserReducer from './reducers/UserReducer'
import { reducer as websocketReducer } from './websockets'

var rootReducer = combineReducers({
    user: UserReducer,
    readingList: ReadingListReducer,
    integrations: IntegrationsReducer,
})

export default rootReducer
