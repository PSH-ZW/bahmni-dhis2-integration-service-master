import * as sinon from "sinon";
import Ajax from "../../../main/client/common/Ajax";
import {getDeltaData} from "../../../main/client/utils/PreviewUtil";

describe('PreviewUtils', function () {
    describe('getDeltaData', function () {
        it('should get delta data', async function () {
            let ajax = new Ajax();
            let expectedDeltaData = {
                result : [{
                    "Patient Identifier": "NAH0000000035",
                    "Org Unit": "ZWNSC-MABASA CLINIC[26]",
                    "Instance Date Created": "2018-10-01 08:06:58",
                    "UIC": "KLATTA011084M",
                    "Enrollment Date": "2018-10-01",
                    "Incident Date": "2018-10-01",
                    "Enrollment Status": "ACTIVE",
                    "Prog Enrollment Date Created": "2018-10-01 08:06:58",
                    "Event Date": "2018-10-01",
                    "Program": "Ox4qJuR5jAI",
                    "Program Stage": "QbpaWLIJVli",
                    "Event Status": "ACTIVE",
                    "Event Date Created": "2018-10-01 08:07:22",
                    "phtc": "true"
                }, {
                    "Patient Identifier": "NAH0000000023",
                    "Org Unit": "ZWNSC-MABASA CLINIC[26]",
                    "Instance Date Created": "2018-09-22 08:54:57",
                    "UIC": "JKEWTA220951F",
                    "Enrollment Date": "2018-09-22",
                    "Incident Date": "2018-09-22",
                    "Enrollment Status": "ACTIVE",
                    "Prog Enrollment Date Created": "2018-09-22 08:18:27",
                    "Event Date": null,
                    "Program": null,
                    "Program Stage": null,
                    "Event Status": null,
                    "Event Date Created": null,
                    "phtc": null
                }, {
                    "Patient Identifier": "NAH0000000038",
                    "Org Unit": null,
                    "Instance Date Created": "2018-10-01 15:42:16",
                    "UIC": "HIIKGE011098MT1",
                    "Enrollment Date": "2018-10-01",
                    "Incident Date": "2018-10-01",
                    "Enrollment Status": "ACTIVE",
                    "Prog Enrollment Date Created": "2018-10-01 15:15:29",
                    "Event Date": null,
                    "Program": null,
                    "Program Stage": null,
                    "Event Status": null,
                    "Event Date Created": null,
                    "phtc": null
                }],
                generatedDate: "2018-10-18 11:55:52"
            };

            let mappingName = 'someMapping';
            let sandbox = sinon.createSandbox();
            sandbox.stub(Ajax, 'instance').returns(ajax);
            let ajaxMock = sandbox.mock(ajax)
                .expects('get')
                .withArgs('/dhis-integration/api/getDeltaData',{mappingName: mappingName})
                .returns(Promise.resolve(expectedDeltaData));
            let deltaData = await getDeltaData(mappingName);

            expect(deltaData).toEqual(expectedDeltaData);

            ajaxMock.verify();
            sandbox.restore()
        });
    });
});