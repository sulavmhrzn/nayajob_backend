namespace Express {
    interface Request {
        user?: {
            id: number;
            email: string;
            role: string;
            isVerified: boolean;
        };
    }
}
