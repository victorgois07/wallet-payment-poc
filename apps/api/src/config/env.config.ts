import * as z from 'zod';

export const envSchema = z.object({
  API_PORT: z.coerce.number().default(3000),
  API_HOST: z.string().default('0.0.0.0'),
  API_PREFIX: z.string().default('v1'),
  CORS_ORIGINS: z.string().default('http://localhost:8081'),
  THROTTLE_TTL: z.coerce.number().default(60000),
  THROTTLE_LIMIT: z.coerce.number().default(10),
  DB_TYPE: z.enum(['sqlite', 'sqljs']).default('sqlite'),
  DB_DATABASE: z.string().default('wallet.sqlite'),
  LOG_LEVEL: z.string().default('info'),
  PAYMENT_STRATEGY: z.enum(['sequential', 'parallel']).default('parallel'),
  PAYMENT_FAILURE_RATE: z.coerce.number().min(0).max(1).default(0.1),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.error.format()}`);
  }
  return result.data;
}
