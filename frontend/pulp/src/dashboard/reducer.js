
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
            console.log(action)
            return Object.assign({}, state, {
                readingList: {
                    loading: state.readingList.loading,
                    list: [
                        ...state.readingList.list.filter(item => item.url !== action.url),
                        action.article
                    ]
                }
            })
        case "ADDING_ARTICLE":
            return Object.assign({}, state, {
                readingList: {
                    loading: state.readingList.loading,
                    list: [
                        ...state.readingList.list,
                        {
                            placeholder: true,
                            url: action.url
                        }
                    ]
                }
            })
        case "REMOVE_ARTICLE":
            return Object.assign({}, state, {
                readingList: {
                    loading: state.readingList.loading,
                    list: state.readingList.list.filter(item => item.url !== action.url)
                }
            })
        case "ARCHIVE_ARTICLE":
            return Object.assign({}, state, {
                readingList: {
                    loading: state.readingList.loading,
                    list: state.readingList.list.filter(item => item.url !== action.url)
                },
                archive: {
                    loading: state.archive.loading,
                    list: [...state.archive, state.readingList.list.find(item => item.url === action.url)]
                }
            })
        case "LOADING_ARTICLES":
            return Object.assign({}, state, {
                readingList: {
                    loading: true
                }
            })
        case "LOADED_ARTICLES":
            return Object.assign({}, state, {
                readingList: {
                    loading: false,
                    list: action.articles
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
                        })
                },
                archive: {
                    loading: false,
                    list: action.articles
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
                }
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