import sinon from 'sinon';
import auditLog from '../../../main/client/common/AuditLog';
import Ajax from '../../../main/client/common/Ajax';
import {audit, auditLogEventDetails} from '../../../main/client/common/constants';

describe('AuditLog', () => {

    it('should call OpenMRS Rest API', async function () {
        let ajax = Ajax.instance();
        let sandbox = sinon.createSandbox();

        sandbox.stub(Ajax, "instance").returns(ajax);

        let postMock = sandbox.mock(ajax).expects("post")
            .withArgs(audit.URI, auditLogEventDetails.SAVE_DHIS_MAPPING)
            .returns(Promise.resolve());

        await auditLog(auditLogEventDetails.SAVE_DHIS_MAPPING);

        postMock.verify();
        sandbox.restore();
    });
});