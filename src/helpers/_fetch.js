import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {URLFILE} from '../../config';

const baseURL = URLFILE + `/api`;

const getAuth = async () => {
  let ACCESS;

  try {
    ACCESS = await AsyncStorage.getItem('token_login');
  } catch (e) {
    ACCESS = await AsyncStorage.removeItem('token_login');
  }

  return ACCESS;
};

export const _fetch = async (
  url,
  options = {
    method: 'GET',
    body: {},
  },
) => {
  const authorization = await getAuth();
  const request = {
    method: options.method,
    baseURL,
    url,
    headers: {
      'x-access-token': authorization,
      'Content-Type': 'application/json',
    },
  };

  if (request.method === 'POST' || request.method === 'PUT') {
    request.data = options.body;
  }

  try {
    const res = await axios(request);

    if (res.status >= 200 && res.status < 400) {
      return res;
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      AsyncStorage.removeItem('token_login');
    } else {
      throw error;
    }
  }
};
