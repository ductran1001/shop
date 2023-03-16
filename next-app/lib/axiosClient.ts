import axios from 'axios';

export const API_URL = 'https://shoppe-demo.onrender.com/';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// REQUEST
axiosClient.interceptors.request.use(
    (config) => {
        let token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : '';
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

// RESPONSE

axiosClient.interceptors.response.use(
    async (response) => {
        const token = response.data?.contents?.token;

        const refreshToken = response.data?.contents?.refreshToken;

        // LOGIN
        if (token) window.localStorage.setItem('token', token);

        if (refreshToken) window.localStorage.setItem('refreshToken', refreshToken);

        return response;
    },
    async (error) => {
        if (error?.response?.status !== 401) return Promise.reject(error);

        const originalConfig = error.config;

        if (error?.response?.status === 401 && !originalConfig.sent) {
            originalConfig.sent = true;
            try {
                // Trường hợp không có token thì chuyển sang trang LOGIN
                let token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : '';

                if (!token && !error.response.data.message) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/';
                        return Promise.reject(error);
                    }
                }

                let refreshToken = typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : '';
                if (refreshToken) {
                    const response = await axiosClient.post('/api/auth/refresh-token', {
                        refreshToken: refreshToken,
                    });

                    const { token } = response.data;
                    window.localStorage.setItem('token', token);

                    originalConfig.headers = {
                        ...originalConfig.headers,
                        authorization: `Bearer ${token}`,
                    };

                    return axiosClient(originalConfig);
                } else {
                    return Promise.reject(error);
                }
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }
);

export { axiosClient };
