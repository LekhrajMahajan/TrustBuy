import axios from 'axios';


// Helper to ensure URL ends with /api
const getBaseUrl = () => {
  // Use the user-provided production URL as the default priority
  let url = import.meta.env.VITE_API_URL || 'https://trustbuy.onrender.com/api';

  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  // Ensure it ends with /api if not already there
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_URL = getBaseUrl();

console.log('🔌 Connecting to API:', API_URL); // Debug Log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productService = {
  getAllProducts: async () => {
    // ✅ Add console log to debug response
    try {
      const response = await api.get('/products');
      console.log("API Response (Products):", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  getMyProducts: async () => {
    const response = await api.get('/products/myproducts');
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  createReview: async (id, reviewData) => {
    const response = await api.post(`/products/${id}/reviews`, reviewData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  }
};

// ... (keep other services as they are)
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};

export const adminService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
  getSellers: async () => {
    const response = await api.get('/admin/sellers');
    return response.data;
  }
};

export default api;