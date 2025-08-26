import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

export const createAxiosInstance = (
  config?: CreateAxiosDefaults,
): AxiosInstance => {
  const instance = axios.create({
    timeout: 1000,
    ...config,
  });

  return instance;
};
