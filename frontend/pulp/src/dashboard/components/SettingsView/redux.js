import $ from 'jquery'

var initialState = {
    loadingEmail: true,
    loadingSubscription: true,
}

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

export function populateUserState(dispatch) {
    return Promise.all([
        populateEmail(dispatch),
        populateSubscription(dispatch)
    ])
}

export function reducer(state = initialState, action) {
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