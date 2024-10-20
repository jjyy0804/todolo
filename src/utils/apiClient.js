import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor for 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === '/api/users/login') return;
    if (originalRequest.url === '/api/users/refresh-token') return;

    console.log({ originalRequest: originalRequest });

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; //횟수제한

      try {
        // Call the same endpoint to validate and refresh the access token
        const response = await apiClient.post('/api/users/refresh-token');

        const newAccessToken = response.data.accessToken;

        // Store newAccessToken in localStorage
        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        // window.location.href = '/login'; // 수정필요...
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
