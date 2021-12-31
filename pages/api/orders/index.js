import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';
var http = require('http');
import nodemailer from "nodemailer"


const handler = nc({
  onError,
});


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user:'sgoyall322@gmail.com',
    pass:'Jai@12345678'
  }
});


handler.use(isAuth);

handler.post(async (req, res) => {

  var hostname = req.headers.host; // hostname = 'localhost:8080'
  var finall = 'http://' + hostname;

  await db.connect();
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    razorpay_payment_id: req.body.razorpay_payment_id,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice, 
    userEmail: req.body.userEmail,
    isPaid:true,
    user: req.user._id,
    paidAt:new Date()
  });
  const order = await newOrder.save();

  await transporter.sendMail({
    from:'sgoyall322@gmail.com',
    to:order.userEmail,
    subject:`Order Confirmation from Jewellery world of shivam Gems.`,
    html:`Thank you <b>${order.shippingAddress.fullName.split(" ")[0]}</b> for your order (${order._id}). Your order will be delivered soon ,To visit order history click : ${finall}/order/${order._id}`
  },(err,info)=>{
    if(err){
      console.log(err);
    }else{
      console.log(info);
    }
  });
  res.status(201).send(order);
});

export default handler;
