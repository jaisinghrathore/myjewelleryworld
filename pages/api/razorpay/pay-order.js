import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';

    const handler = nc({
    onError,
});

handler.use(isAuth);

handler.post(async(req, res) => {
    try {
        await db.connect();
        const newOrder = Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        amount: req.body.amount, 
        userEmail: req.body.userEmail,
        isPaid:true,
        user: req.user._id,
        paidAt:new Date(),
        razorpay: {
            orderId: req.body.razorpayOrderId,
            paymentId: req.body.razorpayPaymentId,
            signature: req.body.razorpaySignature,
          },
        });
    
        const order = await newOrder.save();

        res.status(201).send(order);

      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
});

export default handler;
