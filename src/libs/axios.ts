import axios from "axios";
import { env } from "../env";
import {
  getStorageItemAsync,
  setStorageItemAsync,
} from "../hooks/use-storage-state";
import * as AxiosLogger from "axios-logger";

export const api = axios.create({ baseURL: env.EXPO_PUBLIC_API_URL });

api.interceptors.request.use(
  async (request) => {
    try {
      const accessToken = await getStorageItemAsync("accessToken");
      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return AxiosLogger.responseLogger(response, {
      dateFormat: "isoDateTime",
      data: false,
      params: true,
    });
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getStorageItemAsync("refreshToken");
        if (refreshToken) {
          console.warn("Refreshing token...");
          const refreshTokenResponse = await axios.post<{
            accessToken: string;
            refreshToken: string;
          }>(`${env.EXPO_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
          const data = refreshTokenResponse.data;
          const newAccessToken = data.accessToken;
          const newRefreshToken = data.refreshToken;
          await setStorageItemAsync("accessToken", newAccessToken);
          await setStorageItemAsync("refreshToken", newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);
