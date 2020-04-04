import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import Dashboard from './components/Dashboard'
import { populateIntegrations } from './components/Integrations/redux'
import { populateReadingList } from './components/ReadingListView/redux'
import reducer from './reducer'

const store = createStore(reducer, applyMiddleware(thunk))

// TODO This would all be better done in one request...

function populateEmail(dispatch) {
    // TODO this doesn't use the csrf token!!!
    return $.ajax({
        url: "/api/users/get_email",
        type: "GET",
    }).then(
        (response) => dispatch({ type: "LOADED_EMAIL", email: response }),
        (error) => console.log(error)
    )
}

function populateInitialState() {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();

        return Promise.all([
            populateEmail(dispatch),
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
