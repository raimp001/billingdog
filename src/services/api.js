import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001', // Update with your backend URL if different
});

export const submitTransaction = async (transaction) => {
  try {
    const response = await api.post('/submit-transaction', transaction);
    return response.data;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const searchICDCodes = async (query) => {
  try {
    const response = await axios.get(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?q=${query}`); // Replace with actual API
    return response.data;
  } catch (error) {
    console.error('Error fetching ICD codes:', error);
    throw error;
  }
};
