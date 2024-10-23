import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationUrl = `http://yourdomain.com/api/auth/verify-email?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: `<a href="${verificationUrl}">Click here to verify your email</a>`,
    });
};
