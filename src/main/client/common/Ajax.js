import { audit, sync } from './constants';

const responseCodes = {
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  OK: 200,
  USER_UNAUTHORISED: 401
};

export default class Ajax {
  static instance() {
    return new Ajax();
  }

  async post(url, data) {
    return await this.request(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  async put(url, data) {
    return await this.request(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  async get(url, queryParams = {}) {
    const keys = Object.keys(queryParams);
    let actualUrl = url;

    if (keys.length) {
      const keyValues = keys.map(queryKey => `${queryKey}=${encodeURIComponent(queryParams[queryKey])}`);
      actualUrl = `${url}?${keyValues.join('&')}`;
    }
    return await this.request(actualUrl, {
      method: 'GET'
    });
  }

  async request(url, params) {
    const response = await Fetch.request(url, params);

    if (response.status === responseCodes.USER_UNAUTHORISED) {
      Window.redirect('/home');
      return;
    }

    if (response.status === responseCodes.OK) {
      if (url !== audit.URI && !url.includes(sync.URI)) {
        return await response.json();
      }
      return response;
    } else if (response.status === responseCodes.INTERNAL_SERVER_ERROR) {
      if (url.includes(sync.URI)) {
        throw response;
      }
      throw 'Could not able to connect to server';
    } else if (response.status === responseCodes.FORBIDDEN) {
      throw 'Session Timed Out. Login again.';
    } else if (response.status === responseCodes.NOT_FOUND) {
      throw 'Could not able to get the details';
    }

    throw response;
  }
}

export class Fetch {
  static async request(url, params) {
    return await fetch(url, params);
  }
}

export class Window {
  static redirect(location) {
    window.location.pathname = location;
  }
}
