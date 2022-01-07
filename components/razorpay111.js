// import React, { useContext, useEffect, useState } from 'react';
// import { Store } from '../utils/Store';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import { useSnackbar } from 'notistack';
// import { getError } from '../utils/error';
// import Cookies from 'js-cookie';

// function loadScript(src) {
// 	return new Promise((resolve) => {
// 		const script = document.createElement('script')
// 		script.src = src
// 		script.onload = () => {
// 			resolve(true)
// 		}
// 		script.onerror = () => {
// 			resolve(false)
// 		}
// 		document.body.appendChild(script)
// 	})
// }



// function Razo() {

// 	const router = useRouter();
// 	const { state, dispatch } = useContext(Store);

// 	const {
// 		userInfo,
// 		cart: { cartItems, shippingAddress, paymentMethod },
// 	  } = state;

//   const { closeSnackbar, enqueueSnackbar } = useSnackbar();
//   const [loading, setLoading] = useState(false);


// 	useEffect(() => {
// 		if (!userInfo) {
// 			router.push('/login');
// 		  }
// 		if (!paymentMethod) {
// 		  router.push('/payment');
// 		}
// 		if (cartItems.length === 0) {
// 		  router.push('/cart');
// 		}
// 	  }, []);

// 	  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
// 	  const itemsPrice = round2(
// 		cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
// 	  );
// 	  const shippingPrice = 80;
// 	//   const taxPrice = round2(itemsPrice * 3/100);
// 	//   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

//   const totalPrice = round2(itemsPrice + shippingPrice);


// const promise = new Promise((res,rej)=>{
//     async function displayRazorpay() {
// 		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

// 		if (!res) {
// 			alert('Razorpay SDK failed to load. Are you online?')       
// 			return
// 		}
		
// 		const options = {
// 			key:process.env.RAZORPATSECRET,
// 			currency: "INR",
// 			amount: totalPrice * 100,
// 			order_id: "",
// 			name:"Hello " + shippingAddress.fullName,
// 			description: 'Thank you for your interest.',
// 			handler: function (response) {
// 				// localStorage.setItem("success","true");
// 				// localStorage.setItem("payment","false");
					
//   	const placeOrderHandler = async () => {
//     closeSnackbar();
//     try {
//       setLoading(true);
//       const { data } = await axios.post(
//         '/api/orders',
//         {
//           orderItems: cartItems,
//           shippingAddress,
//           paymentMethod,
// 		  razorpay_payment_id:response.razorpay_payment_id,
//           itemsPrice,
//           shippingPrice,
//         //   taxPrice,
// 		totalPrice, 
//           isPaid:true,
// 		  userEmail:userInfo.email
//         },
//         {
//           headers: {
//             authorization: `Bearer ${userInfo.token}`,
//           },
//         }
//       )
	  
//       dispatch({ type: 'CART_CLEAR' });
//       Cookies.remove('cartItems');
// 	  window.location.replace(`/order/${data._id}`);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       enqueueSnackbar(getError(err), { variant: 'error' });
//     }
//   };

//   placeOrderHandler();	

// 			},
// 			prefill: {
// 				name:shippingAddress.fullName,
// 				email: userInfo.email,
// 				contact: shippingAddress.phone
// 			}
// 		}
// 		const paymentObject = new window.Razorpay(options)
// 		paymentObject.open()
// 	}

// 	if (paymentMethod && cartItems.length > 0 && userInfo) {
// 		displayRazorpay()
// 	}
   
// }).then(()=>{
//     alert("...");
// })


// 	return (
// 		<div className="App" style={{height:"100vh",width:"100%",backgroundColor:"black"}}>
// 		</div>
// 	)
// }

// export default Razo