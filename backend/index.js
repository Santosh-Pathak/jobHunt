//create server
import express from 'express';
import cookieParser from 'cookie-parser'; // to store the user data in the cookies so that the user can be authenticated and authorized in the future requests to the server 
import cors from 'cors'; // to allow the requests from the frontend to the backend server 
import dotenv from 'dotenv'; // to use the environment variables in the project
import connectDB from './utils/db.js'; // to connect to the database
import userRoute from './routes/user.route.js'; // to use the user routes in the project
import companyRoute from './routes/company.route.js'; // to use the company routes in the project
dotenv.config(); // to use the environment variables in the project
const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json()); // jabham request bhejte hain toh data json me convert karne ke liye
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

//API's 
app.use('/api/v1/user', userRoute);
//"https://localhost:3000/api/v1/register" => register USer Route
//"https://localhost:3000/api/v1/login" => userRoute
//"https://localhost:3000/api/v1/profile/update" => userRoute

app.use('/api/v1/company', companyRoute);



app.listen(PORT, () => {
  connectDB(); // to connect to the database
  console.log(`Server started at port ${PORT}`);
});



//SAMPLE CODE FOR MORE HINTS AND HELP 

// app.use('/api/v1/product', productRoute);
// app.use('/api/v1/order', orderRoute);
// app.use('/api/v1/category', categoryRoute);
// app.use('/api/v1/cart', cartRoute);
// app.use('/api/v1/payment', paymentRoute);
// app.use('/api/v1/checkout', checkoutRoute);
// app.use('/api/v1/checkout/order', checkoutOrderRoute);
// app.use('/api/v1/checkout/payment', checkoutPaymentRoute);
// app.use('/api/v1/checkout/cart', checkoutCartRoute);
// app.use('/api/v1/checkout/address', checkoutAddressRoute);
// app.use('/api/v1/checkout/summary', checkoutSummaryRoute);
// app.use('/api/v1/checkout/confirm', checkoutConfirmRoute);
// app.use('/api/v1/checkout/complete', checkoutCompleteRoute);
// app.use('/api/v1/checkout/failed', checkoutFailedRoute);
// app.use('/api/v1/checkout/success', checkoutSuccessRoute);
// app.use('/api/v1/checkout/cancel', checkoutCancelRoute);
// app.use('/api/v1/checkout/return', checkoutReturnRoute);
// app.use('/api/v1/checkout/notify', checkoutNotifyRoute);
// app.use('/api/v1/checkout/notify/success', checkoutNotifySuccessRoute);
// app.use('/api/v1/checkout/notify/failed', checkoutNotifyFailedRoute);
// app.use('/api/v1/checkout/notify/cancel', checkoutNotifyCancelRoute);
// app.use('/api/v1/checkout/notify/return', checkoutNotifyReturnRoute);
// app.use('/api/v1/checkout/notify/complete', checkoutNotifyCompleteRoute);
// app.use('/api/v1/checkout/notify/summary', checkoutNotifySummaryRoute);
// app.use('/api/v1/checkout/notify/confirm', checkoutNotifyConfirmRoute);
// app.use('/api/v1/checkout/notify/address', checkoutNotifyAddressRoute);
// app.use('/api/v1/checkout/notify/payment', checkoutNotifyPaymentRoute);
// app.use('/api/v1/checkout/notify/order', checkoutNotifyOrderRoute);
// app.use('/api/v1/checkout/notify/cart', checkoutNotifyCartRoute);
// app.use('/api/v1/checkout/notify/failed', checkoutNotifyFailedRoute);
