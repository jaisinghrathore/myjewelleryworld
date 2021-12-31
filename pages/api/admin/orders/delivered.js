import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth, isAdmin } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
  await db.connect();
  const orders = await Order.findOne({_id:req.body.id}).populate('user', 'name');

  if(orders.isDelivered){
    res.status(401).send({ message: "already delivered" });
  }
  else if(orders){
    try{
  var upd = await Order.updateOne({_id:req.body.id},{
    $set:{
      isDelivered: true,
      deliveredAt: Date.now()
    }
 })
}catch(err){
  res.status(401).send({ message: "Error Occered in Updating" });
}
  }else{
    res.status(401).send({ message: "user doesn't exist" });
  }
  await db.disconnect();
  res.send(upd);
});

export default handler;
