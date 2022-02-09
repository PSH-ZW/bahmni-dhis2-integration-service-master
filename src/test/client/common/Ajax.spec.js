import * as sinon from 'sinon';
import Ajax, { Fetch, Window } from '../../../main/client/common/Ajax';

describe('Ajax', () => {
  let ajax;
  let params;
  let url;
  let sandbox;

  beforeEach(() => {
    ajax = new Ajax();
  });

  describe('#request', () => {
    beforeEach(() => {
      url = '/someEndPoint';
      params = {
        method: 'PUT',
        body: {
          user: 'Pedda reddy',
          comment: 'Jai balayya',
          service: 'HIV Testing Service'
        }
      };
    });

    it('should return response in json', async () => {
      const expectedResponse = {
        status: 200,
        statusText: 'OK'
      };
      const response = {
        status: 200,
        json: () => expectedResponse
      };
      sandbox = sinon.createSandbox();
      const fetchMock = sandbox.mock(Fetch)
        .expects('request')
        .withArgs(url, params)
        .returns(Promise.resolve(response));

      const actualResponse = await ajax.request(url, params);

      expect(actualResponse).toEqual(expectedResponse);
      fetchMock.verify();

      sandbox.restore();
    });

    it('should redirect to home', async () => {
      const response = {
        status: 401
      };

      sandbox = sinon.createSandbox();
      const fetchMock = sandbox.mock(Fetch)
        .expects('request')
        .withArgs(url, params)
        .returns(Promise.resolve(response));

      const windowMock = sandbox.mock(Window)
        .expects('redirect')
        .withArgs('/home');

      await ajax.request(url, params);

      fetchMock.verify();
      windowMock.verify();

      sandbox.restore();
    });

    it('should throw exception on "Internal Server Error', async () => {
      const response = {
        status: 500
      };

      sandbox = sinon.createSandbox();

      const fetchMock = sandbox.mock(Fetch)
        .expects('request')
        .withArgs(url, params)
        .returns(Promise.resolve(response));

      try {
        await ajax.request(url, params);
      } catch (e) {
        expect(e).toEqual('Could not able to connect to server');
      }

      fetchMock.verify();

      sandbox.restore();
    });

    it('should throw exception on "FORBIDDEN"', async () => {
      const response = {
        status: 403
      };

      sandbox = sinon.createSandbox();

      const fetchMock = sandbox.mock(Fetch)
        .expects('request')
        .withArgs(url, params)
        .returns(Promise.resolve(response));

      try {
        await ajax.request(url, params);
      } catch (e) {
        expect(e).toEqual('Session Timed Out. Login again.');
      }

      fetchMock.verify();

      sandbox.restore();
    });

    it('should throw exception on "404 NOT FOUND"', async () => {
      const response = {
        status: 404
      };

      sandbox = sinon.createSandbox();

      const fetchMock = sandbox.mock(Fetch)
        .expects('request')
        .withArgs(url, params)
        .returns(Promise.resolve(response));

      try {
        await ajax.request(url, params);
      } catch (e) {
        expect(e).toEqual('Could not able to get the details');
      }

      fetchMock.verify();

      sandbox.restore();
    });
  });

  describe('#get', () => {
    it('should request the server without queryParams', async () => {
      const url = '/getTables';
      const response = {
        allTables: [
          'hts_instance_table',
          'person_attributes',
          'hts_program_enrollment_table',
          'hts_program_events_table'
        ]
      };

      sandbox = sinon.createSandbox();

      const requestMock = sandbox.mock(ajax)
        .expects('request')
        .withArgs(url, {
          method: 'GET'
        })
        .returns(Promise.resolve(response));

      const actualResponse = await ajax.get(url);

      expect(actualResponse).toEqual(response);

      requestMock.verify();
    });

    it('should request the server with queryParams', async () => {
      const url = '/getMapping';
      const response = {
        mapping_name: 'testing 106',
        lookup_table: {
          instance: 'hts_program_enrollment_table',
          enrollments: 'hts_program_enrollment_table',
          event: 'hts_program_events_table'
        },
        mapping_json: {
          instance: {
            Patient_Identifier: 'sfd'
          },
          event: {
            Patient_Identifier: 'asdf'
          }
        }
      };

      sandbox = sinon.createSandbox();

      const requestMock = sandbox.mock(ajax)
        .expects('request')
        .withArgs(`${url}?mappingName=testing%20106`, {
          method: 'GET'
        })
        .returns(Promise.resolve(response));

      const actualResponse = await ajax.get(url, {
        mappingName: 'testing 106'
      });

      expect(actualResponse).toEqual(response);

      requestMock.verify();
    });
  });

  describe('#put', () => {
    it('should request the server', async () => {
      const url = '/sync/pushData';

      sandbox = sinon.createSandbox();

      const requestMock = sandbox.mock(ajax)
        .expects('request')
        .withArgs(url, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify(params.body)
        });

      await ajax.put(url, params.body);

      requestMock.verify();
    });
  });

  describe('#post', () => {
    it('should request the server', async () => {
      const url = '/sync/pushData';

      sandbox = sinon.createSandbox();

      const requestMock = sandbox.mock(ajax)
        .expects('request')
        .withArgs(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify(params.body)
        });

      await ajax.post(url, params.body);

      requestMock.verify();
    });
  });
});
