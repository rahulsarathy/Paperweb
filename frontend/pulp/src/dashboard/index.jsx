import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import Dashboard from './components/Dashboard'
import { populateIntegrations } from './components/Integrations/redux'
import { populateReadingList } from './components/ReadingListView/redux'
import { populateUserState } from './components/SettingsView/redux'
import { connectToWebSocket } from './websockets'
import reducer from './reducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

// TODO This would all be better done in one request...
function populateInitialState() {
    return function(dispatch) {
        return Promise.all([
            connectToWebSocket(dispatch),
            populateUserState(dispatch),
            populateReadingList(dispatch),
            populateIntegrations(dispatch),
        ])
    }
}

store.dispatch(populateInitialState())

ReactDOM.render(
    <Provider store={store}>
        <Dashboard />
    </Provider>,
    document.getElementById("root")
)
