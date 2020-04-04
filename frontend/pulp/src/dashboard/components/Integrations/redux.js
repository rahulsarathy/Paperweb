import $ from 'jquery'

var initialState = {
    pocket: {
        loading: true
    },
    instapaper: {
        loading: true
    }
}

export function populateIntegrations(dispatch) {
    // TODO This request doesn't use the csrf token
    $.ajax({
      url: "/api/users/get_services",
      type: "GET",
    }).then(
        (response) => dispatch({ type: "LOADED_INTEGRATIONS", integrations: response }),
        (error) => console.log(error)
    )
}

export function integratePocket() {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        let data = {
            csrfmiddlewaretoken: csrftoken
        };

        $.ajax({
            type: "POST",
            data: data,
            url: "/api/pocket/request_pocket",
        }).then(
            (response) => dispatch({ type: "POCKET_CHANGED", integrated: true }),
            (error) => console.log(error) // Todo
        )
    }
}

export function removePocket() {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        let data = {
            csrfmiddlewaretoken: csrftoken
        };

        $.ajax({
            type: "POST",
            data: data,
            url: "/api/pocket/remove_pocket",
        }).then(
            (response) => dispatch({ type: "POCKET_CHANGED", integrated: false }),
            (error) => console.log(error) // Todo
        )
    }
}

export function integrateInstapaper(username, password) {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        let data = {
            username: username, // TODO SECURITY!!!!
            password: password, // TODO SECURITY!!!!
            csrfmiddlewaretoken: csrftoken
        };

        $.ajax({
            type: "POST",
            data: data,
            url: "/api/instapaper/authenticate_instapaper",
        }).then(
            (response) => dispatch({ type: "INSTAPAPER_CHANGED", integrated: true }),
            (error) => console.log(error) // Todo
        )
    }
}

export function removeInstapaper() {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        let data = {
            csrfmiddlewaretoken: csrftoken
        };

        $.ajax({
            type: "POST",
            data: data,
            url: "/api/instapaper/remove_instapaper",
        }).then(
            (response) => dispatch({ type: "INSTAPAPER_CHANGED", integrated: false }),
            (error) => console.log(error) // Todo
        )
    }
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case "LOADED_INTEGRATIONS":
            return Object.assign({}, state, {
                pocket: {
                    loading: false,
                    integrated: action.integrations.pocket.signed_in
                },
                instapaper: {
                    loading: false,
                    integrated: action.integrations.instapaper.signed_in
                }, 
            })
        case "POCKET_CHANGED":
            return Object.assign({}, state, {
                pocket: {
                    loading: false,
                    integrated: action.inegrated,
                },
                instapaper: state.instapaper,
            })
        case "INSTAPAPER_CHANGED":
            return Object.assign({}, state, {
                instapaper: {
                    loading: false,
                    integrated: action.integrated,
                },
                pocket: state.pocket,
            })
        default:
            return state
    }
}

export default reducer