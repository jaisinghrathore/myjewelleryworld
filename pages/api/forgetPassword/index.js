import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import { signTokenfiveMin } from '../../../utils/auth';
var http = require('http');
import nodemailer from "nodemailer"

const handler = nc();

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

handler.post(async (req, res) => {
  
  var hostname = req.headers.host; // hostname = 'localhost:8080'
  var finall = 'http://' + hostname;

  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();
  if(!user){
    res.status(401).send({ message: 'Invalid email!' });
  }
  const token = signTokenfiveMin(user);

   await transporter.sendMail({
    from:'sgoyall322@gmail.com',
    to:user.email,
    subject:"Verification link.",
    html:`Go  to  this  link  ${finall}/changePassword?token=${token}`
  },(err,info)=>{
    if(err){
      console.log(err);
    }else{
      console.log(info);
    }
  });
  res.send(token);

});

export default handler;