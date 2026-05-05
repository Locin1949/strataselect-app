// client/src/api/index.js

import http from './http';

const api = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete
};

export default api;
