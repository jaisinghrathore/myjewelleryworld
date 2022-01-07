import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';


function Razo() {
  const [loading, setLoading] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);
  const [orders, setOrders] = useState([]);

  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
        router.push('/login');
      }
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);


  const {
      userInfo,
      cart: { cartItems, shippingAddress, paymentMethod },
    } = state;


    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
    const itemsPrice = round2(
      cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
    );
    const shippingPrice = 80;
  //   const taxPrice = round2(itemsPrice * 3/100);
  //   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  
  var totalPrice = round2(itemsPrice + shippingPrice);

  
  function loadRazorpay() {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
      alert('Razorpay SDK failed to load. Are you online?');
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post('/api/razorpay/create-order', {
            amount:  totalPrice * 100,
        },
        {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
        const {
          data: { key: razorpayKey },
        } = await axios.get('/api/razorpay/get-razorpay-key');
        const options = {
          key: razorpayKey,
          amount: result.data.amount,
          currency: 'INR',
          name: shippingAddress.fullName,
          description: 'Proceed to success.',
          order_id: result.data.id,
          handler: async function (response) {
            const resultt = await axios.post('/api/razorpay/pay-order', {
            //   amount: amount,
            //   razorpayPaymentId: response.razorpay_payment_id,
            //   razorpayOrderId: response.razorpay_order_id,
            //   razorpaySignature: response.razorpay_signature,
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            razorpay_payment_id:response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            itemsPrice,
            shippingPrice,
            amount:totalPrice, 
            isPaid:true,
            userEmail:userInfo.email
            }
            ,{
                headers: {
                  authorization: `Bearer ${userInfo.token}`,
                },
              });
            dispatch({ type: 'CART_CLEAR' });
            Cookies.remove('cartItems');
	        window.location.replace(`/order/${resultt.data._id}`);
          },
          prefill: {
            name:shippingAddress.fullName,
            email: userInfo.email,
            contact: shippingAddress.phone
          },
        };

        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  }

  React.useEffect(()=>{
    loadRazorpay();
  },[])
   

  return (
    <div className="App" style={{height:"100vh",width:"100%",backgroundColor:"black"}}>
    </div>
  );
}

export default Razo;