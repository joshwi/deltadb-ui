const { get, POSTY } = require("../utility/REST")
const types = require("./types")

export function updateAuth() {
    return function (dispatch) {
        return getAccessTokenSilently({audience: `https://joshwi.com:5000`})
            .then(credentials => {
                dispatch({ type: types.UPDATE_AUTH, credentials: credentials })
            }).catch(error => {
                throw error
            })
    }
}

export function loadKeys() {
    return function (dispatch) {
        return get(`/api/v2/admin/db/keys`).then(keys => {
            dispatch({ type: types.LOAD_KEYS, keys: keys })
        }).catch(error => {
            throw error
        })
    }
}

// export function loadColorThemes() {
//     return function (dispatch) {
//         return get(`/api/v2/admin/db/node/colors?query=n.tag=~'.*'`).then(teams => {
//             dispatch({ type: types.LOAD_COLOR_THEMES, teams: teams })
//         }).catch(error => {
//             throw error
//         })
//     }
// }

export function initStatus(status) {
    return function (dispatch) {
        return dispatch({ type: types.INIT_STATUS, status: status })
    }
}

export function updateCategory(key, data) {
    return function (dispatch) {
        return dispatch({ type: types.UPDATE_CATEGORY, key: key, data: data })
    }
}

export function updatePageState(view, schema, data) {
    return function (dispatch) {
        return dispatch({ type: types.UPDATE_PAGE_STATUS, view: view, schema: schema, data: data })
    }
}

export function updatePage(key, data) {
    return function (dispatch) {
        return dispatch({ type: types.UPDATE_PAGE, key: key, data: data })
    }
}

export function loadParams(params) {
    return function (dispatch) {
        return dispatch({ type: types.LOAD_PARAMS, params: params })
    }
}

export function setParams(params) {
    return function (dispatch) {
        return dispatch({ type: types.SET_PARAMS, params: params })
    }
}

export function toggleSidebar() {
    return function (dispatch) {
        return dispatch({ type: types.TOGGLE_SIDEBAR })
    }
}

