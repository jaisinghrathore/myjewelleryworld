import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const handler = nc();

handler.post(async (req, res) => {

    const token = req.query.token;

  await db.connect();
  jwt.verify(token,  process.env.JWT_SECRET , async(err, decoded)=>{
        if(err){
        res.status(401).send({ message: 'Invalid token!' });
            }
    if(decoded){
        const id = decoded._id;
        try{
        const upd = await User.findByIdAndUpdate({_id:id},{
            $set:{
                password: bcrypt.hashSync(req.body.password)
            }
        })
        res.send(upd);  
        }catch(err){
    res.status(401).send({ message: 'Invalid token!' });
        }
    }
  });
  await db.disconnect();

});

export default handler;
        