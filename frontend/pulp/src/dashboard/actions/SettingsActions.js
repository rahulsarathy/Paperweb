import $ from 'jquery'

export function loadSettings(settings) {
    return {
        type: "LOADED_SETTINGS",
        settings: settings
    }
}

export function changeSetting(setting, updatedValue) {
    return {
        type: "CHANGE_SETTING",
        key: setting,
        value: updatedValue,
    }
}

export function setAddress(address) {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var address_json = {
            // TODO include recipient name in this data...
            line_1: address.line_1,
            line_2: address.line_2,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country
        };
        var data = {
            address_json: JSON.stringify(address_json),
            csrfmiddlewaretoken: csrftoken
        };

        return $.ajax({
            type: "POST",
            data: data,
            url: "/api/users/set_address/",
        }).then(
            (response) => dispatch(changeSetting("address", response)),
            (error) => console.log(error)
        );
    }
}