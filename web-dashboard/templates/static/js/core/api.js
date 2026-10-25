/**
 * Unified REST API Fetch Client
 * Configured with same-origin credentials, structured error handling,
 * and 401 unauthenticated redirect handling.
 */

export class API {
  static async request(url, options = {}) {
    const headers = {
      Accept: 'application/json',
      ...options.headers,
    };

    if (options.body !== undefined && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      credentials: 'same-origin',
      ...options,
      headers,
    };

    const res = await fetch(url, config);

    if (res.status === 401) {
      window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
      return null;
    }

    if (res.status === 204) {
      return null;
    }

    let data;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => ({}));
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const message = (data && data.message) || `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  static get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  static post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  static put(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  static delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}
