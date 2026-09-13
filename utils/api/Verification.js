// api/verification.js

import axios from 'axios';
import { BASE_URL } from '../../utils/constants/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
      'Content-Type': 'application/json',
       "X-App-Secret": "smartboyakriti"
  },
});

export const createVerification = async () => {
  const response = await api.get('/authenticate');

  return response.data;
};

export const checkVerificationStatus = async (sessionId) => {
  const response = await api.get('/checkstatus', {
    params: {
      session_id: sessionId,
    },
  });

  return response.data;
};

export const authenticate = async (data) => {
  const response = await api.post('/semi/authenticate',
    data
  );

  console.log(response);
  return response.data;
};