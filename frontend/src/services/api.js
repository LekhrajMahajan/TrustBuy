import axios from 'axios';


// Determine API base URL from environment variable, fallback to local backend
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Cleanup: Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  // Cleanup: Ensure it ends with /api
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token
api.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem('userInfo'); // This is the main one we use in AuthContext
      const token = localStorage.getItem('token'); // Fallback

      let authToken = null;

      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser && parsedUser.token) {
          authToken = parsedUser.token;
        }
      }

      if (!authToken && token) {
        authToken = token;
      }

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error("Error in Axios Interceptor:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productService = {
  getAllProducts: async () => {
    // Add console log to debug response
    try {
      const response = await api.get('/products');
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
  },
  getUserId: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data._id;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  },
  registerSeller: async (sellerData) => {
    const response = await api.put('/users/seller/register', sellerData);
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
  },
  suspendSeller: async (id) => {
    const response = await api.put(`/admin/seller/${id}/suspend`);
    return response.data;
  },
  verifySeller: async (id) => {
    const response = await api.put(`/admin/seller/${id}/verify`);
    return response.data;
  },
  approveProduct: async (id) => {
    const response = await api.put(`/admin/product/${id}/approve`);
    return response.data;
  },
  getAdminProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data;
  },
  exportUsers: async () => {
    const response = await api.get('/admin/export-users', { responseType: 'blob' });
    return response.data;
  },
  exportSellers: async () => {
    const response = await api.get('/admin/export-sellers', { responseType: 'blob' });
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  }
};

export default api;