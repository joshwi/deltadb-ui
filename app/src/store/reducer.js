const { combineReducers } = require("redux")
const types = require("./types")

const authReducer = (state = {}, action) => {
    switch (action.type) {
        case types.LOAD_AUTH:
            return { ...state, ...action.user }
        case types.UPDATE_AUTH:
            return { ...state, ...action.user }
        default:
            return state
    }
}

const keyReducer = (state = {}, action) => {
    switch (action.type) {
        case types.LOAD_KEYS:
            return { ...state, ...action.keys }
        default:
            return state
    }
}

const teamReducer = (state = {}, action) => {
    switch (action.type) {
        case types.LOAD_COLOR_THEMES:
            return { ...state, colors: action.teams }
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
    auth:  authReducer,
    status: siteReducer,
    keys: keyReducer,
    teams: teamReducer
})

export default rootReducer