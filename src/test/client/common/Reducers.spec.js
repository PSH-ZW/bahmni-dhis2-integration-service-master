import {
    hideSpinner,
    showHomeButton,
    showMessage,
    session,
    showHeader
} from '../../../main/client/common/Reducers';

describe('Reducers', () => {
    describe('HideSpinnerReducer', () => {
        it('should return true with default params', () => {
            expect(hideSpinner()).toBeTruthy();
        });

        it('should return hideSpinner value as action.hideSpinner value when action type is hideSpinner', () => {
            const action = {
                type: 'hideSpinner',
                hideSpinner: true
            };
            expect(hideSpinner(false, action)).toBeTruthy();
        });

        it('should return state value when action.type is not hideSpinner', () => {
            const action = {
                type: 'showSpinner'
            };
            expect(hideSpinner(false, action)).toBeFalsy();
        })
    });

    describe('showMessage', () => {
        it('should return empty message and type on default', () => {
           expect(showMessage()).toEqual({ 'responseMessage': '', 'responseType': '' });
        });

        it('should return state when the action type is not showMessage', () => {
            let state = { 'responseMessage': '', 'responseType': '' };
            let action = { type: "message" };
            expect(showMessage(state, action)).toEqual(state);
        });

        it('should return state when the action type is not showMessage', () => {
            let state = { 'responseMessage': '', 'responseType': '' };
            let action = { type: "showMessage", responseMessage: "message", responseType: "success" };
            expect(showMessage(state, action)).toEqual({ 'responseMessage': "message", 'responseType': "success" });
        });
    });

    describe('ShowHomeButtonReducer', () => {
        it('should return true with default params', () => {
            expect(showHomeButton()).toBeTruthy();
        });

        it('should return showHomeButton value as action.show value when action type is showHome', () => {
            const action = {
                type: 'showHome',
                show: true
            };
            expect(showHomeButton(false, action)).toBeTruthy();
        });

        it('should return state value when action.type is not showHome', () => {
            const action = {
                type: 'hideHome'
            };
            expect(showHomeButton(false, action)).toBeFalsy();
        })
    });


    describe('ShowHeaderReducer', () => {
        it('should return true with default params', () => {
            expect(showHeader()).toBeTruthy();
        });

        it('should return showHomeButton value as action.show value when action type is showHome', () => {
            const action = {
                type: 'showHeader',
                show: true
            };
            expect(showHeader(false, action)).toBeTruthy();
        });

        it('should return state value when action.type is not showHome', () => {
            const action = {
                type: 'hideHome'
            };
            expect(showHeader(false, action)).toBeFalsy();
        })
    });

    describe('privilegesReducer', () => {
        it('should return empty array with default params', () => {
            expect(session()).toEqual({"privileges": [], "user": ''});
        });

        it('should return session as action.session when action type is session', () => {
            const action = {
                type: 'session',
                session: {user: 'admin', privileges: ["mapping"]}
            };
            expect(session({}, action).privileges).toEqual(["mapping"]);
        });

        it('should return state value when action.type is not showHome', () => {
            const action = {
                type: 'noPrev'
            };
            expect(showHomeButton([], action)).toEqual([]);
        })
    });
});