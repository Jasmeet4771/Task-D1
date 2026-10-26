
const express = require("express");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check that required environment variables exist
if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.error("Missing SendGrid environment variables in .env");
    process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json({ limit: "10kb" }));

// Newsletter subscription endpoint
app.post(["/subscribe", "/api/subscribe"], async (req, res) => {
    try {
        const email =
            typeof req.body?.email === "string"
                ? req.body.email.trim()
                : "";

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        const message = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: "Welcome to DEV@Deakin!",
            text: "Thank you for subscribing to the DEV@Deakin Daily Insider!",
            html: `
                <h1>Welcome to DEV@Deakin!</h1>
                <p>Thank you for subscribing to our Daily Insider.</p>
                <p>We are excited to have you with us!</p>
            `
        };

        const response = await sgMail.send(message);
        const statusCode = response[0].statusCode;

        console.log("Email accepted by SendGrid.");
        console.log("SendGrid status:", statusCode);

        return res.status(202).json({
            message: "Subscription successful! Check your inbox."
        });
    } catch (error) {
        console.error(
            "Email error:",
            error.response?.body || error.message
        );

        return res.status(500).json({
            message: "Unable to send the welcome email. Please try again later."
        });
    }
});

// Handle invalid JSON payloads
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON request."
        });
    }

    next(error);
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
