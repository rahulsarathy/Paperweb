import $ from 'jquery'

var initialState = {
    loading: true
}

export function populateReadingList(dispatch) {
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
            (response) => dispatch({ type: "ARTICLE_ADDED", articles: response }),
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

export function reducer(state = initialState, action) {
    switch (action.type) {
        case "ADDING_ARTICLE":
            return Object.assign({}, state, {
                loading: state.loading,
                list: [
                    ...state.list,
                    {
                        loading: true,
                        url: action.url
                    }
                ]
            })
        case "ARTICLE_ADDED":
            return Object.assign({}, state, {
                loading: state.loading,
                list: action.articles.map((item) => {
                    return {
                        title: item.article.title,
                        url: item.article.permalink,
                        author: item.article.author,
                        preview: item.article.preview_text,
                        image: item.article.image_url,
                        archived: item.archived,
                        loading: false,
                    }
                })
            })
        case "REMOVE_ARTICLE":
            return Object.assign({}, state, {
                loading: state.loading,
                list: state.list.filter(item => item.url !== action.url)
            })
        case "ARTILE_REMOVED":
            // TODO display some kind of message to the user here that the removal was successful
            return state
        case "ARCHIVE_ARTICLE":
            return Object.assign({}, state, {
                loading: state.readingList.loading,
                list: state.readingList.list.map(item => (item.url === action.url) ? Object.assign({}, item, { archived: true }) : item)
            })
        case "ARTICLE_ARCHIVED":
            // TODO again, display a message
            return state
        case "LOADING_ARTICLES":
            return Object.assign({}, state, {
                loading: true
            })
        case "LOADED_ARTICLES":
            return Object.assign({}, state, {
                loading: false,
                list: action.articles.map((item) => {
                    return {
                        title: item.article.title,
                        url: item.article.permalink,
                        author: item.article.author,
                        preview: item.article.preview_text,
                        image: item.article.image_url,
                        archived: item.archived,
                        placeholder: false,
                    }
                })
            })
        default:
            return state
    }
}