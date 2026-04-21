import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    timeout: 5000,
    withCredentials: true,
});

let refreshPromise = null;

const persistAuth = (token, user) => {
    if (typeof window === 'undefined') return;

    if (token) {
        localStorage.setItem('kalossToken', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        document.cookie = `kalossToken=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    }

    if (user) {
        localStorage.setItem('kalossUser', JSON.stringify(user));
        if (user.role) {
            document.cookie = `kalossRole=${encodeURIComponent(user.role)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        }
    }
};

const clearAuth = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('kalossToken');
    localStorage.removeItem('kalossUser');
    delete api.defaults.headers.common.Authorization;
    document.cookie = 'kalossToken=; path=/; max-age=0; samesite=lax';
    document.cookie = 'kalossRole=; path=/; max-age=0; samesite=lax';
};

api.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('kalossToken');
        if (storedToken) {
            config.headers = {
                ...(config.headers || {}),
                Authorization: `Bearer ${storedToken}`,
            };
        }
    }

    return config;
});

export const setToken = token => {
    if (typeof window !== 'undefined') {
        if (token) {
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common.Authorization;
        }
    }
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config || {};
        const status = error.response?.status;
        const requestUrl = originalRequest.url || '';
        const isAuthRefreshRequest = requestUrl.includes('/auth/refresh-token');
        const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

        if (status !== 401 || originalRequest._retry || isAuthRefreshRequest || isAuthRequest) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            refreshPromise = refreshPromise || api.post('/auth/refresh-token');
            const { data } = await refreshPromise;
            persistAuth(data.token, data.user);
            originalRequest.headers = {
                ...(originalRequest.headers || {}),
                Authorization: `Bearer ${data.token}`,
            };
            return api(originalRequest);
        } catch (refreshError) {
            clearAuth();
            return Promise.reject(refreshError);
        } finally {
            refreshPromise = null;
        }
    }
);

export const fetchProducts = params => api.get('/products', { params });
export const fetchProductById = id => api.get(`/products/${id}`);
export const fetchProductRegions = () => api.get('/products/regions');
export const fetchRelatedProducts = id => api.get(`/products/related/${id}`);
export const fetchProductReviews = productId => api.get(`/products/reviews/${productId}`);
export const createProductReview = (productId, payload) => api.post(`/products/reviews/${productId}`, payload);
export const fetchFarmers = params => api.get('/farmers', { params });
export const fetchFarmerById = id => api.get(`/farmers/${id}`);
export const fetchImpact = () => api.get('/impact');
export const fetchPress = () => api.get('/press');
export const fetchAwards = () => api.get('/awards');
export const fetchAboutRegions = () => api.get('/regions');
export const submitContactInquiry = payload => api.post('/contact/submit', payload);
export const fetchFaqs = params => api.get('/faqs', { params });
export const markFaqHelpful = (id, payload) => api.post(`/faqs/${id}/helpful`, payload);
export const submitWholesaleInquiry = payload => api.post('/contact/wholesale', payload);
export const submitFarmVisitRequest = payload => api.post('/contact/farm-visit', payload);
export const fetchCareerOpenings = () => api.get('/careers/openings');
export const submitJobApplication = payload => api.post('/careers/apply', payload);
export const sendChatMessage = payload => api.post('/chat/message', payload);
export const fetchChatMessages = sessionId => api.get(`/chat/messages/${sessionId}`);
export const subscribeContactNewsletter = payload => api.post('/newsletter/subscribe', payload);
export const fetchHomepageData = () => api.get('/homepage');
export const fetchReviews = () => api.get('/reviews');
export const createReview = payload => api.post('/reviews', payload);
export const fetchCeremonySteps = () => api.get('/ceremony-steps');
export const incrementProductView = productId => api.post(`/products/${productId}/view`);
export const submitQuiz = payload => api.post('/quiz/submit', payload);
export const subscribeNewsletter = payload => api.post('/subscribe', payload);
export const login = credentials => api.post('/auth/login', credentials);
export const register = data => api.post('/auth/register', data);
export const requestLoginOtp = payload => api.post('/auth/login/otp', payload);
export const verifyLoginOtp = payload => api.post('/auth/login/verify-otp', payload);
export const logoutUser = () => api.post('/auth/logout');
export const refreshAuthToken = payload => api.post('/auth/refresh-token', payload);
export const forgotPassword = payload => api.post('/auth/forgot-password', payload);
export const resetPassword = payload => api.post('/auth/reset-password', payload);
export const verifyEmailOtp = payload => api.post('/auth/verify-email', payload);
export const verifyPhoneOtp = payload => api.post('/auth/verify-phone', payload);
export const enableTwoFactor = () => api.post('/auth/2fa/enable');
export const verifyTwoFactorSetup = payload => api.post('/auth/2fa/verify', payload);
export const disableTwoFactor = () => api.post('/auth/2fa/disable');
export const fetchProfile = () => api.get('/user/profile');
export const updateProfile = payload => api.put('/user/profile', payload);
export const changePassword = payload => api.put('/user/change-password', payload);
export const fetchAddresses = () => api.get('/user/addresses');
export const addAddress = payload => api.post('/user/addresses', payload);
export const updateAddress = (id, payload) => api.put(`/user/addresses/${id}`, payload);
export const deleteAddress = id => api.delete(`/user/addresses/${id}`);
export const fetchWishlist = () => api.get('/user/wishlist');
export const addWishlistItem = productId => api.post(`/user/wishlist/${productId}`);
export const removeWishlistItem = productId => api.delete(`/user/wishlist/${productId}`);
export const fetchUserOrders = () => api.get('/user/orders');
export const fetchSessions = () => api.get('/user/sessions');
export const terminateSession = id => api.delete(`/user/sessions/${id}`);
export const applyReferral = payload => api.post('/user/referral/apply', payload);
export const fetchLoyalty = () => api.get('/user/loyalty');
export const createOrder = data => api.post('/orders', data);
export const getUserOrders = () => api.get('/orders/mine');
export const getOrderById = id => api.get(`/orders/${id}`);
export const getOrderByNumber = orderNumber => api.get(`/orders/track/${orderNumber}`);
export const cancelOrder = id => api.post(`/orders/${id}/cancel`);
export const applyDiscount = payload => api.post('/cart/apply-discount', payload);
export const initiatePayment = payload => api.post('/payments/initiate', payload);
export const verifyGatewayPayment = payload => api.post('/payments/verify', payload);
export const uploadBankTransferReceipt = payload => api.post('/payments/bank-transfer/upload', payload);
export const fetchAdminDashboardStats = () => api.get('/admin/dashboard/stats');
export const fetchAdminProducts = params => api.get('/admin/products', { params });
export const createAdminProduct = payload => api.post('/admin/products', payload);
export const updateAdminProduct = (id, payload) => api.put(`/admin/products/${id}`, payload);
export const approveAdminProduct = id => api.post(`/admin/products/${id}/approve`);
export const rejectAdminProduct = (id, payload) => api.post(`/admin/products/${id}/reject`, payload);
export const deleteAdminProduct = id => api.delete(`/admin/products/${id}`);
export const fetchPendingAdminProducts = () => api.get('/admin/products/pending');
export const fetchAdminOrders = params => api.get('/admin/orders', { params });
export const fetchAdminOrderById = id => api.get(`/admin/orders/${id}`);
export const updateAdminOrderStatus = (id, payload) => api.put(`/admin/orders/${id}/status`, payload);
export const verifyAdminPayment = (id, payload) => api.post(`/admin/orders/${id}/verify-payment`, payload);
export const rejectAdminPayment = (id, payload) => api.post(`/admin/orders/${id}/reject-payment`, payload);
export const fetchPendingAdminPayments = () => api.get('/admin/payments/pending');
export const fetchAdminUsers = params => api.get('/admin/users', { params });
export const updateAdminUserRole = (id, payload) => api.put(`/admin/users/${id}/role`, payload);
export const banAdminUser = (id, payload) => api.post(`/admin/users/${id}/ban`, payload);
export const unbanAdminUser = id => api.post(`/admin/users/${id}/unban`);
export const deleteAdminUser = id => api.delete(`/admin/users/${id}`);
export const fetchAdminLogs = () => api.get('/admin/logs');

export default api;

