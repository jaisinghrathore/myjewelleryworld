import nc from 'next-connect';

const handler = nc();

handler.get((req, res) => {
    res.send({ key: process.env.RAZORPAY_KEY_ID });
});

export default handler;
