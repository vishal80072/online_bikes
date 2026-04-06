import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api/v1' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post('http://localhost:8000/api/v1/auth/refresh', {
            refresh_token: refresh,
          });
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  login: (username, password) => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    return api.post('/auth/login', form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  },
  register: (data) => api.post('/auth/register', data),
};

export const bikesAPI = {
  list: (params) => api.get('/bikes', { params }),
  get: (id) => api.get(`/bikes/${id}`),
  create: (data) => api.post('/bikes', data),
  update: (id, data) => api.put(`/bikes/${id}`, data),
  delete: (id) => api.delete(`/bikes/${id}`),
};

export const chatAPI = {
  send: (message) => api.post('/chat', { message }),
};