/* TODO move everything in this file into a single query to the server to 
   speed things up */
import $ from 'jquery'
import { createWebSocket } from '../websockets'
import { loadSettings, loadAddress } from './SettingsActions'

/* Connect to the websocket */
function connectToWebSocket(dispatch) {
    return new Promise(function (resolve, reject) {
        let progressSocket = createWebSocket(dispatch)
        progressSocket.onopen = () => resolve(progressSocket)
        progressSocket.onerror = (err) => reject(err)
    })
}

/* Populate the initial state with the users email */
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

/* Populate the initial state with the users email address */
function populateSubscription(dispatch) {
    // TODO this doesnt use the csrf token!!!!
    return $.ajax({
        url: "/api/payments/payment_status",
        type: "GET",
    }).then(
        (response) => dispatch({ 
            type: "LOADED_SUBSCRIPTION",
            subscribed: (response.status == 208)
        }),
        (error) => console.log(error) // TODO
    )
}

/* Populate the initial state with the users settings */
function populateSettings(dispatch) {
    // TODO this request doesnt use the csrf token
    return $.ajax({
        url: "/api/users/get_settings",
        type: "GET",
    }).then(
        (response) => dispatch(loadSettings(response)),
        (error) => console.log(error) // TODO
    )
}

/* Populate the intial state with the users address */
function populateAddress(dispatch) {
    // TODO this request doesnt use the csrf token
    return $.ajax({
        type: "GET",
        url: "/api/users/get_address/",
    }).then(
        (response) => dispatch(loadAddress(response)),
        (error) => console.log(error)
    )
}

/* Run all of the user related initial state actions */
function populateUserState(dispatch) {
    return Promise.all([
        populateSettings(dispatch), // TODO merge all of these things into a single api call...
        populateAddress(dispatch),
        populateEmail(dispatch),
        populateSubscription(dispatch)
    ])
}

/* Populate the initial state with the users reading list */
function populateReadingList(dispatch) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    let data = {
      csrfmiddlewaretoken: csrftoken
    };

    dispatch({ type: "LOADING_ARTICLES" })

    return $.ajax({
      url: "/api/reading_list/get_reading",
      data: data,
      type: "GET"
    }).then(
        (response) => dispatch({ type: "LOADED_ARTICLES", articles: response }),
        (error) => console.log(error)
    )
}

/* Populate the initial state with the users integration information */
function populateIntegrations(dispatch) {
    // TODO This request doesn't use the csrf token
    $.ajax({
      url: "/api/users/get_services",
      type: "GET",
    }).then(
        (response) => dispatch({ type: "LOADED_INTEGRATIONS", integrations: response }),
        (error) => console.log(error)
    )
}

/* Run all of the initial state actions */
export function populateInitialState() {
    return function(dispatch) {
        return Promise.all([
            connectToWebSocket(dispatch),
            populateUserState(dispatch),
            populateSettings(dispatch),
            populateReadingList(dispatch),
            populateIntegrations(dispatch),
        ])
    }
}