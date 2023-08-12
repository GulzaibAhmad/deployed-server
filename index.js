const express = require('express');
const app = express();

const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use(express.static('client/build'));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello from Express' });
});

app.post('/api/contact', async (req, res) => {
    const { from, message } = req.body;

    if (!from || !message) {
        return res.status(400).json({
            status: 'error',
            message: 'Both "from" and "message" fields are required.'
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: from,
        to: process.env.EMAIL_USERNAME,
        subject: 'New message from contact form',
        text: `From: ${from} \n Message: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent!!!');
        res.json({
            status: 'success',
            message: 'Email sent'
        });
    } catch (error) {
        console.log('Error occurs', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to send email.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});
