import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import {
    hideSpinner,
    showHome,
    showMessage,
    session,
    getSession,
    ensureActiveSession,
    showHeader
} from '../../../main/client/common/Actions';
import Ajax from '../../../main/client/common/Ajax';

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);
describe('Actions', () => {
    describe('HideSpinnerAction', () => {
        it('should return hideSpinner value as true as default', () => {
            const expected = {
                type: "hideSpinner",
                hideSpinner: true
            };
            let result = hideSpinner();
            expect(expected).toEqual(result);
        });

        it('should return given value as hideSpinner value', () => {
            const expected = {
                type: "hideSpinner",
                hideSpinner: false
            };
            let result = hideSpinner(false);
            expect(expected).toEqual(result);
        })
    });

    describe('showMessage', () => {
        it('should return empty message and type on default', () => {
           const expected = {
               type: "showMessage",
               responseMessage: "",
               responseType: ""
           };

           expect(expected).toEqual(showMessage())
        });

        it('should return object with given message and type on default', () => {
           const expected = {
               type: "showMessage",
               responseMessage: "test message",
               responseType: "error"
           };

           expect(expected).toEqual(showMessage("test message", "error"));
        });
    });

    describe('showHomeAction', () => {
        it('should return showHome value as true as default', () => {
            const expected = {
                type: "showHome",
                show: true
            };
            let result = showHome();
            expect(expected).toEqual(result);
        });

        it('should return given value as showHome value', () => {
            const expected = {
                type: "showHome",
                show: false
            };
            let result = showHome(false);
            expect(expected).toEqual(result);
        })
    });

    describe('showHeaderAction', () => {
        it('should return showHeader value as true as default', () => {
            const expected = {
                type: "showHeader",
                show: true
            };
            let result = showHeader();
            expect(expected).toEqual(result);
        });

        it('should return given value as showHeader value', () => {
            const expected = {
                type: "showHeader",
                show: false
            };
            let result = showHeader(false);
            expect(expected).toEqual(result);
        })
    });

    describe('session', () => {
        it('should return empty session as default', () => {
            const expected = {
                type: "session",
                session: {"privileges": [], "user": ''}
            };
            let result = session();
            expect(expected).toEqual(result);
        });

        it('should return given value as showHome value', () => {
            const expected = {
                type: "session",
                session: {user: 'admin', privileges: ["dhis2:mapping"]}
            };
            let result = session({user: 'admin', privileges: ["dhis2:mapping"]});
            expect(expected).toEqual(result);
        })
    });

    describe('getSession', () => {
        it('should dispatch session when response has session', async () => {
            let sandbox = sinon.createSandbox();
            let ajax = new Ajax();
            let store = mockStore({
                hideSpinner: true,
                showMessage: {
                    responseMessage: "",
                    responseType: ""
                }
            });
            let session = {user: 'admin', privileges: "[app:dhis2sync, dhis2:mapping, dhis2:log]"};
            sandbox.stub(Ajax, "instance").returns(ajax);
            let privilegesMock = sandbox.mock(ajax).expects("get")
                .withArgs('/dhis-integration/api/session')
                .returns(Promise.resolve(session));

            let expectedActions = [
                {
                    type: "hideSpinner",
                    hideSpinner: false
                },
                {
                    type: "session",
                    session
                },
                {
                    type: "hideSpinner",
                    hideSpinner: true
                }
            ];

            await store.dispatch(getSession());

            expect(store.getActions()).toEqual(expectedActions);

            privilegesMock.verify();

            sandbox.restore();
        });

        it('should dispatch show message with no permissions when response has no session', async () => {
            let sandbox = sinon.createSandbox();
            let ajax = new Ajax();
            let store = mockStore({
                hideSpinner: true,
                showMessage: {
                    responseMessage: "",
                    responseType: ""
                }
            });
            let session = {user: 'admin', privileges: "[app:dhis2sync]"};
            sandbox.stub(Ajax, "instance").returns(ajax);
            let privilegesMock = sandbox.mock(ajax).expects("get")
                .withArgs('/dhis-integration/api/session')
                .returns(Promise.resolve(session));

            let expectedActions = [
                {
                    type: "hideSpinner",
                    hideSpinner: false
                },
                {
                    type: "showMessage",
                    responseMessage: "You do not have permissions assigned. Contact admin to assign privileges for your user",
                    responseType: "error"
                },
                {
                    type: "hideSpinner",
                    hideSpinner: true
                }
            ];

            await store.dispatch(getSession());

            expect(store.getActions()).toEqual(expectedActions);

            privilegesMock.verify();

            sandbox.restore();
        });
    });

    describe('ensureActiveSession', () => {
        it('should dispatch session if store does not have it', async () => {
            let sandbox = sinon.createSandbox();
            let ajax = new Ajax();
            let store = mockStore({
                session: {
                    user: '',
                    privileges: []}
            });
            let session = {user: 'admin', privileges: "[app:dhis2sync, dhis2:mapping, dhis2:log]"};
            sandbox.stub(Ajax, "instance").returns(ajax);
            let privilegesMock = sandbox.mock(ajax).expects("get")
                .withArgs('/dhis-integration/api/session')
                .returns(Promise.resolve(session));

            let expectedActions = [
                {
                    type: "hideSpinner",
                    hideSpinner: false
                },
                {
                    type: "session",
                    session
                },
                {
                    type: "hideSpinner",
                    hideSpinner: true
                }
            ];

            await store.dispatch(ensureActiveSession());

            expect(store.getActions()).toEqual(expectedActions);

            privilegesMock.verify();

            sandbox.restore();
        });
    });
});
