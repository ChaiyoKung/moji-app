import axios from "axios";
import { env } from "../env";
import * as AxiosLogger from "axios-logger";
import { sessionStore } from "../stores/session-store";

export const api = axios.create({ baseURL: `${env.EXPO_PUBLIC_API_URL}/api` });

api.interceptors.request.use(
  async (request) => {
    try {
      const accessToken = sessionStore.getState().accessToken;
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

async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const refreshToken = sessionStore.getState().refreshToken;
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  console.warn("Refreshing token...");
  const refreshTokenResponse = await axios.post<RefreshTokenResponse>(
    `${env.EXPO_PUBLIC_API_URL}/api/auth/refresh`,
    { refreshToken }
  );
  const data = refreshTokenResponse.data;
  sessionStore.setState({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data;
}

let refreshTokenPromise: Promise<RefreshTokenResponse> | null = null;
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

      // Use a shared promise to ensure only one refresh request is sent at a time.
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken();
        refreshTokenPromise.finally(() => {
          refreshTokenPromise = null;
        });
      }

      try {
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
