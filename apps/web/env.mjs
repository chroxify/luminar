import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    RESEND_API_KEY: z.string().optional(),
    GITHUB_SECRET: z.string(),
    VERCEL_PROJECT_ID: z.string().optional(),
    VERCEL_TEAM_ID: z.string().optional(),
    VERCEL_AUTH_TOKEN: z.string().optional(),
    TINYBIRD_API_KEY: z.string().optional(),
    TRIGGER_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_ROOT_DOMAIN: z.string(),
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY: z.string().optional(),
  },
  shared: {
    SUBDOMAIN_HOSTING: z.enum(['true', 'false']).default('false'),
    DASHBOARD_SUBDOMAIN: z.string().optional(),
    CUSTOM_DOMAIN_WHITELIST: z.string().optional(),
    GITHUB_CLIENT_ID: z.string(),
    TINYBIRD_API_URL: z.string().url().optional(),
    TRIGGER_PROJECT_ID: z.string().optional(),
    TRIGGER_API_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUBDOMAIN_HOSTING: process.env.SUBDOMAIN_HOSTING,
    DASHBOARD_SUBDOMAIN: process.env.DASHBOARD_SUBDOMAIN,
    CUSTOM_DOMAIN_WHITELIST: process.env.CUSTOM_DOMAIN_WHITELIST,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    VERCEL_AUTH_TOKEN: process.env.VERCEL_AUTH_TOKEN,
    TINYBIRD_API_URL: process.env.TINYBIRD_API_URL,
    TINYBIRD_API_KEY: process.env.TINYBIRD_API_KEY,
    TRIGGER_PROJECT_ID: process.env.TRIGGER_PROJECT_ID,
    TRIGGER_API_KEY: process.env.TRIGGER_API_KEY,
    TRIGGER_API_URL: process.env.TRIGGER_API_URL,
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
