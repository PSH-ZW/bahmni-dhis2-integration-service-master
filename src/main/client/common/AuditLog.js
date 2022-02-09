import Ajax from './Ajax';
import { audit } from './constants';

export default async function auditLog(params = {}) {
  try {
    const ajax = Ajax.instance();
    await ajax.post(audit.URI, params);
  } catch (e) {
    window.location.pathname = '/home';
  }
}
