
var initialState = {
    user: {
        email: "robbieguy98@gmail.com",
    },
    subscription: {
        paid: true,
    },
    readingList: [
        {
            id: 1,
            title: "The Eclipse Foundation Releases Eclipse Theia 1.0, a True Open Source Alternative to Visual Studio Code",
            url: "https://www.example.com",
            author: "Testing Testing",
            preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            image: "http://i1.ytimg.com/vi/PB5FosTwM8s/maxresdefault.jpg",
            placeholder: false
        }
    ],
    archive: [],
    pocket: {
        integrated: true,
    },
    instapaper: {
        integrated: true,
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
        default:
            return state
    }
}

export default reducer