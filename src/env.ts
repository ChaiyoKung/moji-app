import { z } from "zod/v4";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
  EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID: z.string(),
  EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID: z.string(),
});

export const env = envSchema.parse(process.env);
