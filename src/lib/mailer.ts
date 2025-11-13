import nodemailer from "nodemailer";


export async function sendMail() {

    try {

        const transporter = nodemailer.createTransport({
            // @ts-ignore
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 465),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_MAIL_PASSWORD,
            },
        })
        return transporter
    } catch (error) {
        console.error(`Error Creating Transport: ${error}`)
        throw new Error(`Error Creating Transport: ${error}`)
    }


}