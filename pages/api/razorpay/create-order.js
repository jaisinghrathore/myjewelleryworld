import nc from 'next-connect';
import Order from '../../../models/Order';
import Razorpay from 'razorpay';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';


const handler = nc({
    onError,
});

handler.use(isAuth);


handler.post(async(req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
          });
          const options = {
            amount: req.body.amount,
            currency: 'INR',
          };
          
          const orderr = await instance.orders.create(options);
          if (!orderr) return res.status(500).send('Some error occured');
          res.status(201).send(orderr);
        } catch (error) {
          res.status(500).send(error);
      }
});

export default handler;

