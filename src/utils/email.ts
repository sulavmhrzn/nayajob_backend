import {
    type CreateEmailResponseSuccess,
    type ErrorResponse,
    Resend,
} from "resend";
import { logger } from "./logger.ts";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailSuccessResponse = {
    success: true;
    data: CreateEmailResponseSuccess | null;
};

type EmailErrorResponse = {
    success: false;
    error: ErrorResponse;
};

export const sendEmail = async (
    to: string[],
    subject: string,
    html: string
): Promise<EmailSuccessResponse | EmailErrorResponse> => {
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: to,
        subject: subject,
        html: html,
    });
    if (error) {
        logger.error("Error sending email", error);
        return { success: false, error };
    }
    logger.info("Email sent successfully", data);
    return { success: true, data };
};

export const sendWelcomeEmail = async (
    to: string[],
    verificationToken: string
) => {
    const subject = "Welcome to NayaJob - Verify Your Account";
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #3498db; margin: 0; font-size: 28px; font-weight: 700;">NayaJob</h1>
                <p style="color: #666; margin: 5px 0 0;">Your Career Starts Here</p>
            </div>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                <h2 style="color: #333; margin-top: 0; font-size: 22px;">Welcome to NayaJob!</h2>
                <p style="color: #555; line-height: 1.5;">Thank you for joining Nepal's premier job marketplace where opportunities meet talent.</p>
            </div>
            
            <!-- Verification Button Section -->
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-radius: 6px; margin: 25px 0;">
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Please verify your email address to get started:</p>
                <a href="${
                    process.env.FRONTEND_URL
                }/verify-account?token=${verificationToken}" 
                   style="background-color: #3498db; color: white; padding: 12px 30px; 
                   text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;
                   box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: all 0.3s;">
                   Verify Your Account
                </a>
                <p style="font-size: 13px; color: #888; margin-top: 15px;">This verification link will expire in 24 hours.</p>
            </div>
            
            <!-- Features Section -->
            <div style="margin: 30px 0; border-top: 1px solid #eee; padding-top: 20px;">
                <h3 style="color: #333; font-size: 18px;">What you can do on NayaJob:</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                    <div style="background-color: #f5f9ff; padding: 15px; border-radius: 5px;">
                        <div style="font-weight: bold; color: #3498db; margin-bottom: 5px;">🔍 For Job Seekers</div>
                        <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Discover new opportunities</li>
                            <li>Build your professional profile</li>
                            <li>Apply with just one click</li>
                        </ul>
                    </div>
                    <div style="background-color: #f5f9ff; padding: 15px; border-radius: 5px;">
                        <div style="font-weight: bold; color: #3498db; margin-bottom: 5px;">💼 For Employers</div>
                        <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Post job openings</li>
                            <li>Find qualified candidates</li>
                            <li>Manage applications efficiently</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
                <p>If you didn't create this account, you can safely ignore this email.</p>
                <p style="margin-top: 15px;">
                    &copy; ${new Date().getFullYear()} NayaJob | <a href="${
        process.env.FRONTEND_URL
    }" style="color: #3498db; text-decoration: none;">nayajob.com.np</a>
                </p>
            </div>
        </div>
    `;

    return await sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (
    to: string[],
    resetToken: string
) => {
    const subject = "Reset Your NayaJob Password";
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <h1 style="color: #3498db; margin: 0; font-size: 28px;">NayaJob</h1>
            <div style="margin: 30px 0;">
                <p>You requested a password reset. Click the button below to create a new password. This link will expire in 15 minutes.</p>
                
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
                   style="background-color: #3498db; color: white; padding: 12px 30px; 
                   text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                   Reset Password
                </a>
                
                <p style="margin-top: 30px; font-size: 13px; color: #888;">
                    If you didn't request this password reset, you can ignore this email.
                </p>
            </div>
        </div>
    `;

    return await sendEmail(to, subject, html);
};
