import $ from 'jquery'

/**
 * Defines an action to update the articles in the users reading list
 * 
 * @param {Array} articles An array of article objects to be fed into the redux
 *     state. These generally come from the server responses to article updates.
 *     (see addArticle)
 */
export function updateArticles(articles) {
    return {
        type: "UPDATE_ARTICLES",
        articles: articles,
    }
}

/**
 * Adds an article to the reading list by url
 * 
 * @param {string} url The url for the article to add. Usually comes from the
 *     user.
 */
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

/**
 * Removes an article from the reading list by url.
 * 
 * @param {string} url The url for the article to remove. Articles are uniquely
 *     identified by their url.
 */
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

/**
 * Archices an article from the reading list by url.
 * 
 * @param {string} url The url for the article to archive.
 */
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