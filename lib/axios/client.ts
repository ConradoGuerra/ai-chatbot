import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import axiosRetry from "axios-retry";

export const createAxiosInstance = (
  config?: CreateAxiosDefaults,
): AxiosInstance => {
  const instance = axios.create({
    timeout: 1000,
    ...config,
  });

  return instance;
};

export const createAxiosRetryInstance = (
  config?: CreateAxiosDefaults,
): AxiosInstance => {
  const instance = createAxiosInstance(config);

  axiosRetry(instance, { retries: 2 });

  return instance;
};

