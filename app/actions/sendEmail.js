'use server';

import nodemailer from 'nodemailer';
import { APP_NAME } from '../config';

export async function sendEmail(email, type) {
    let message = null;
    let subject = null;

    if (type === "subscribe") {
        message = `${email} Subscribed to ${APP_NAME}`
        subject = "New Subscriber";
    } else if (type === "unsubscribe") {
        message = `${email} Unsubscribed from ${APP_NAME}`
        subject = "New Unsubscriber";
    } else {
        return
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: process.env.RECIPIENT_EMAIL,
            subject: subject,
            text: message,
            replyTo: email,
        });
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to send email.' };
    }
}