const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/errors');
//const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const fileupload = require('express-fileupload');
//setting up config file
if (process.env.NODE_ENV === 'PRODUCTION') require('dotenv').config({ path: './config/config.env' });

//routes
const products = require('./routes/product');
const users = require('./routes/user');
const orders = require('./routes/order');
const payments = require('./routes/payment');

//------------------------------------------------------------------
//app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('=====>', 'Node server');
console.log('=====>', process.version);

//------------------------------------------------------------------
//database connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('DB Connected');
    })
    .catch((err) => {
        console.log('DB Connection error', err);
    });

//-----------------------------------------------------------------
//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(fileupload());
app.use('/api/v1', products);
app.use('/api/v1', users);
app.use('/api/v1', orders);
app.use('/api/v1', payments);
app.use(errorMiddleware);

if (process.env.NODE_ENV === 'PRODUCTION') {
    console.log('production !!!!!');
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
}

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
