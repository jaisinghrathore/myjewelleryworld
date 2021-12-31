import mongoose from 'mongoose';

const bannersSchema = new mongoose.Schema(
  {
    bannerImages: [{
        Banner : {
            type: String
        }
    }]
  }  
);

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannersSchema);
export default Banner;
