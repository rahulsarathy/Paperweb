var initialState = {
    loading: true
}

export default function ReadingListReducer(state = initialState, action) {
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
                loading: state.loading,
                list: state.list.map(item => (item.url === action.url) ? Object.assign({}, item, { archived: true }) : item)
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