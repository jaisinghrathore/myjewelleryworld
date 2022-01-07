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
  var finall = 'https://' + hostname;

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
//token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWNjNDNlNDgwNTk4NjIxMThkNTliOTMiLCJuYW1lIjoiamFpIiwiZW1haWwiOiJqYWlycXRob3JlQGdtYWlsLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0MTU3NzI3OSwiZXhwIjoxNjQxNTc3NTc5fQ.ZbOzRpeLwrXU98WW7kPrmLHMr8Ymu2S92IkN1bPcMxw
//token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWNjNDNlNDgwNTk4NjIxMThkNTliOTMiLCJuYW1lIjoiamFpIiwiZW1haWwiOiJqYWlycXRob3JlQGdtYWlsLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0MTU3NzM3NSwiZXhwIjoxNjQxNTc3Njc1fQ.ftVjDIAPEDiN2w9_djeNsQaTg4W70ZCTyFd6e_OVhjQ
});

export default handler;
