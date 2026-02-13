const axios = require('axios');

const API_URL = 'http://localhost:5000/api/products';

const verifyApi = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('API Status:', response.status);
        console.log('Data Type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
        console.log('Data Length:', response.data.length);
        if (response.data.length > 0) {
            console.log('First Product:', JSON.stringify(response.data[0], null, 2));
        }
    } catch (error) {
        console.error('API Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Response Status:', error.response.status);
        }
    }
};

verifyApi();
