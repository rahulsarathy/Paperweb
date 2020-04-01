
var initialState = {
    user: {
        loading: true
    },
    subscription: {
        loading: true
    },
    readingList: {
        loading: true
    },
    archive: {
        loading: true
    },
    pocket: {
        loading: true
    },
    instapaper: {
        loading: true
    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case "ARTICLE_ADDED":
            return Object.assign({}, state, {
                readingList: [
                    ...state.readingList.filter(item => item.url !== action.url),
                    action.article
                ]
            })
        case "ADDING_ARTICLE":
            return Object.assign({}, state, {
                readingList: [
                    ...state.readingList,
                    {
                        placeholder: true,
                        url: action.url
                    }
                ]
            })
        case "REMOVE_ARTICLE":
            return Object.assign({}, state, {
                readingList: state.readingList.filter(item => item.url !== action.url)
            })
        case "ARCHIVE_ARTICLE":
            return Object.assign({}, state, {
                readingList: state.readingList.filter(item => item.id !== action.id),
                archive: [...state.archive, state.readingList.find(item => item.id === action.id)]
            })
        case "LOADING_ARTICLES":
            return Object.assign({}, state, {
                readingList: [] // TODO
            })
        case "LOADED_ARTICLES":
            return Object.assign({}, state, {
                readingList: action.articles
                    .filter((item) => !item.archived)
                    .map((item) => {
                        return {
                            title: item.article.title,
                            url: item.article.permalink,
                            author: item.article.author,
                            preview: item.article.preview_text,
                            image: item.article.image_url,
                            placeholder: false,
                        }
                    }),
                archive: action.articles
                    .filter((item) => item.archived)
                    .map((item) => {
                        return {
                            title: item.article.title,
                            url: item.article.permalink,
                            author: item.article.author,
                            preview: item.article.preview_text,
                            image: item.article.image_url,
                            placeholder: false,
                        }
                    })
            })
        case "LOADED_EMAIL":
            return Object.assign({}, state, {
                user: {
                    loading: false,
                    email: action.email
                }
            })
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
        default:
            return state
    }
}

export default reducer