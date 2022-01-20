const { combineReducers } = require("redux")
const types = require("./types")

const dbReducer = (state = { keys: {}, filters: [] }, action) => {
    switch (action.type) {
        case types.LOAD_KEYS:
            return { ...state, keys: { ...action.keys } }
        case types.LOAD_FILTERS:
            return { ...state, filters: [...action.filters] }
        default:
            return state
    }
}

const viewReducer = (state = { sidebar: true, settings: false }, action) => {
    switch (action.type) {
        case types.SET_VIEW:
            return { ...state, [action.key]: !state.key }
        default:
            return state
    }
}

const paramsReducer = (state = { view: "table", category: "nfl", node: "games", source: "teams", target: "games" }, action) => {
    switch (action.type) {
        case types.SET_PARAMS:
            return { ...state, ...action.params }
        default:
            return state
    }
}

const pagesReducer = (state = { "table_nfl_games": { "filters": [{ "header": "year", "name": "year", "active": true, "value": "20.*" }, { "header": "week", "name": "week", "active": true, "value": "[^\\d]+" }, { "header": "home team", "name": "home_team", "active": true, "value": "City" }] } }, action) => {
    switch (action.type) {
        case types.SET_PAGE:
            return { ...state, [action.key]: { ...state[action.key], ...action.data } }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    view: viewReducer,
    params: paramsReducer,
    pages: pagesReducer,
    db: dbReducer
})

export default rootReducer