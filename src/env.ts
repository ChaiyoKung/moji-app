import { z } from "zod/v4";

export const env = {
  EXPO_PUBLIC_API_URL: z.url().parse(process.env.EXPO_PUBLIC_API_URL),
  EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID: z
    .string()
    .parse(process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID),
  EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID: z
    .string()
    .parse(process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID),
};
