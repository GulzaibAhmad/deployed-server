// express server
const express = require('express')

const app = express()

const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
app.use(cors());

// body parser middleware
app.use(express.json());

const PORT = process.env.PORT || 8080

// serve react app from client build folder
app.use(express.static('client/build'))

// hello team endpoint
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello from Express' })
})

// POST - /api/contact - sends an email - PUBLIC
app.post('/api/contact', (req, res) => {

    let { from, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let mailOptions = {
        to: process.env.EMAIL_USERNAME,
        text: `From: ${from} \n Message: ${message}`,
    };

    try {
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('Error occurs', err);
            } else {
                console.log('Email sent!!!');
            }
        });

    } catch (error) {
        throw error;
    }
    res.json({
        status: 'success',
        message: 'Email sent'
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`)
})
