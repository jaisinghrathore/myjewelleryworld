import nc from 'next-connect';
import db from '../../../../utils/db';
import Banner from '../../../../models/banners';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    const deleteId = req.query.del;
  await db.connect();
    try{
    const banner = await Banner.findById('61a35b53a913200348fd2055');
    const newDatas = banner.bannerImages.filter((val)=>{
        return val._id != deleteId;
    })

    const upd = await Banner.updateOne({_id:'61a35b53a913200348fd2055'},{
        $set:{
            bannerImages: newDatas
        }
    })
    await db.disconnect();
    res.send(upd);
}catch(err){
    res.status(401).send({ message: 'Invalid crediantials.' });
}


});

export default handler;
