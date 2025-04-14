namespace NodeJS {
    interface ProcessEnv {
        PORT: string;
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        DATABASE_URL: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
        RESEND_API_KEY: string;
        RESEND_FROM_EMAIL: string;
        RATE_LIMIT_WINDOW_MS: string;
        RATE_LIMIT_MAX_REQUESTS: string;
    }
}
