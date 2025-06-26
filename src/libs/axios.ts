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

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

let refreshTokenPromise: Promise<RefreshTokenResponse> | null = null;

async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const refreshToken = await getStorageItemAsync("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  console.warn("Refreshing token...");
  const refreshTokenResponse = await axios.post<RefreshTokenResponse>(
    `${env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken }
  );
  const data = refreshTokenResponse.data;
  await setStorageItemAsync("accessToken", data.accessToken);
  await setStorageItemAsync("refreshToken", data.refreshToken);
  return data;
}

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
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken();
          refreshTokenPromise.finally(() => {
            refreshTokenPromise = null;
          });
        }
        const data = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);
