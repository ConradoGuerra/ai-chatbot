import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

const createAxiosInstance = (config?: CreateAxiosDefaults): AxiosInstance => {
  const instance = axios.create({
    timeout: 1000,
    ...config,
  });

  return instance;
};

export default createAxiosInstance;