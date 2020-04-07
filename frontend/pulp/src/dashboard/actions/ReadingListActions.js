import $ from 'jquery'

export function updateArticles(articles) {
    return {
        type: "UPDATE_ARTICLES",
        articles: articles,
    }
}

export function addArticle(url) {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val()
        let data = {
            link: url,
            csrfmiddlewaretoken: csrftoken
        };

        dispatch({ type: "ADDING_ARTICLE", url: url })

        return $.ajax({
            url: "/api/reading_list/add_reading",
            type: "POST",
            data: data,
        }).then(
            (response) => dispatch(updateArticles(response)),
            (error) => console.log(error) // TODO
        )
    }
}

export function removeItem(url) {
    return function(dispatch) {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        let data = {
            link: url,
            csrfmiddlewaretoken: csrftoken
        };

        dispatch({ type: "REMOVE_ARTICLE", url: url });

        $.ajax({
            url: "/api/reading_list/remove_reading",
            type: "POST",
            data: data,
        }).then(
            (response) => dispatch({ type: "ARTICLE_REMOVED", url: url }),
            (error) => console.log(error) // TODO
        )
    }
}

export function archiveItem(url) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    
    return function(dispatch) {
        let data = {
            link: url,
            csrfmiddlewaretoken: csrftoken
        };

        dispatch({ type: "ARCHIVE_ARTICLE", url: url });

        $.ajax({
            url: "/api/reading_list/archive_item",
            type: "POST",
            data: data,
        }).then(
            (response) => dispatch({ type: "ARTICLE_ARCHIVED", url: url }),
            (error) => console.log(error) // TODO
        )
    }
}