import { z } from "zod/v4";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

export const env = envSchema.parse(process.env);
