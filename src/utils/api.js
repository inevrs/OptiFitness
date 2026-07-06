const BASE_URL = '/api';

const fetchWrapper = async (endpoint, options = {}) => {
  const token = localStorage.getItem('zf_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // 8-second timeout — never hang forever
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'API request failed');
    }

    return response.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Request timed out — is the server running?');
    throw err;
  }
};

export const apiGet = (endpoint) => fetchWrapper(endpoint);
export const apiPost = (endpoint, body) => fetchWrapper(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (endpoint, body) => fetchWrapper(endpoint, { method: 'PUT', body: JSON.stringify(body) });
export const apiDelete = (endpoint) => fetchWrapper(endpoint, { method: 'DELETE' });
