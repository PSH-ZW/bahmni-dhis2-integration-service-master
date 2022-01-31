import Ajax from './Ajax';
import { privileges as appPrivileges } from './constants';

export function hideSpinner(hide = true) {
    return {
        type: "hideSpinner",
        hideSpinner: hide
    }
}

export function showMessage(responseMessage = "", responseType = "") {
    return {
        type: "showMessage",
        responseMessage,
        responseType
    };
}

export function showHome(show = true) {
    return {
        type: "showHome",
        show
    }
}

export function showHeader(show = true) {
    return {
        type: "showHeader",
        show
    }
}

export function session(session = {user: '', privileges: []}) {
    return {
        type: "session",
        session
    }
}

export function ensureActiveSession() {
    return async (dispatch, getState) => {
        let state = getState();
        if (!state.session.user && state.session.user.length === 0) {
            await dispatch(getSession());
        }
    }
}

export function getSession() {
    return async dispatch => {
        let ajax = Ajax.instance();
        dispatch(hideSpinner(false));
        try {
            let response = await ajax.get('/dhis-integration/api/session');
            if (!response.user) {
                window.location.pathname = '/home';
            } else {
                let priv = response.privileges.slice(1, -1);
                response.privileges = (priv.split(/\s*,\s*/));

                if (response.privileges.length === 0) {
                    window.location.pathname = '/home';
                }
                (response.privileges.length === 1 && response.privileges.includes(appPrivileges.APP)) ?
                    dispatch(showMessage("You do not have permissions assigned. Contact admin to assign privileges for your user",
                        "error"))
                    : dispatch(session(response));
            }
        } catch (e) {
            window.location.pathname = '/home';
        }
        dispatch(hideSpinner());
    };
}