const { combineReducers } = require("redux")
const types = require("./types")

const keyReducer = (state = {}, action) => {
    switch (action.type) {
        case types.LOAD_KEYS:
            return { ...state, ...action.keys }
        default:
            return state
    }
}

const filterReducer = (state = [], action) => {
    switch (action.type) {
        case types.LOAD_FILTERS:
            return action.filters
        default:
            return state
    }
}

const siteReducer = (state = {}, action) => {
    switch (action.type) {
        case types.INIT_STATUS:
            return action.status
        case types.UPDATE_PAGE_STATUS:
            return {...state, pages: {...state.pages, [action.view]: {...state.pages[action.view], [action.schema]: { ...state.pages[action.view][action.schema], ...action.data}}}}
        case types.UPDATE_PAGE:
            return {...state, pages: {...state.pages, [action.key]: {...state.pages[action.key], ...action.data}}}
        case types.LOAD_PARAMS:
            return { ...state, params: action.params }
        case types.SET_PARAMS:
            return { ...state, params: { ...state.params, ...action.params } }
        case types.TOGGLE_SIDEBAR:
            return { ...state, sidebar: { ...state.sidebar, active: !state.sidebar.active} }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    status: siteReducer,
    keys: keyReducer,
    filters: filterReducer
})

export default rootReducer