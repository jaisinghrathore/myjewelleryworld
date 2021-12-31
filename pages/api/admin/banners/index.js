import nc from 'next-connect';
import Banner from '../../../../models/banners';
import db from '../../../../utils/db';
import { isAuth, isAdmin } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';


const handler = nc({
    onError,
  });



  handler.get(async (req, res) => {
    await db.connect();
    const orders = await Banner.find({});
    await db.disconnect();
    res.send(orders);
  });  


handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  await db.connect();
    
  try{
    const banner = await Banner.findById('61a35b53a913200348fd2055');
    if(banner){
        banner.bannerImages.push({Banner:req.body.banner});
        const result = await banner.save();
        res.send(result);

    }else{
        let banner = new Banner({bannerImages:[{Banner:req.body.banner}]})
        const result = await banner.save();
        res.send(result);
    }
}catch(err) {
    res.status(401).send({ message: 'Invalid crediantials.' });
}

  await db.disconnect();

});





export default handler;
