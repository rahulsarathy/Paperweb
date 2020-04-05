import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import Dashboard from './components/Dashboard'
import { populateIntegrations } from './components/Integrations/redux'
import { populateReadingList } from './components/ReadingListView/redux'
import { populateUserState } from './components/SettingsView/redux'
import reducer from './reducer'

const store = createStore(reducer, applyMiddleware(thunk))

// TODO This would all be better done in one request...
function populateInitialState() {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();

        return Promise.all([
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
