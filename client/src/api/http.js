// client/src/api/http.js

const API = process.env.REACT_APP_API_URL;

async function request(method, path, body) {
  const token = localStorage.getItem('token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API}${path}`, options);

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error || data?.message || 'API request failed';
    throw new Error(message);
  }

  return data;
}

// ⭐ Name the object before exporting it
const http = {
  get: path => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: path => request('DELETE', path)
};

export default http;
