import $ from 'jquery'

// Integrates the users pocket account
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

// Removes the users pocket integration
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