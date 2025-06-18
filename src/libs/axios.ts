import axios from "axios";
import { env } from "../env";
import { getStorageItemAsync } from "../hooks/use-storage-state";
import * as AxiosLogger from "axios-logger";

export const api = axios.create({ baseURL: env.EXPO_PUBLIC_API_URL });

api.interceptors.request.use(
  async (request) => {
    try {
      const token = await getStorageItemAsync("session");
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
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

api.interceptors.response.use((response) => {
  return AxiosLogger.responseLogger(response, {
    dateFormat: "isoDateTime",
    data: false,
  });
});
