import $ from 'jquery'

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
