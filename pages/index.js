import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useContext, useReducer } from 'react';
import NextLink from 'next/link';
import { Grid, Link, Typography } from '@material-ui/core';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import Carousel from 'react-material-ui-carousel';
import useStyles from '../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}


export default function Home(props) {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { topRatedProducts, featuredProducts } = props;
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };



  const [{ loading, error, summary }, dispatchh] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatchh({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/banners`);
        dispatchh({ type: 'FETCH_SUCCESS', payload: data[0].bannerImages });
      } catch (err) {
        dispatchh({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);


  if(error){
    return error
  }else if(loading){
    return(
      <div style={{display:"flex",justifyContent:"center",placeItems: "center",height:'100vh',width:'100%'}}>
      <CircularProgress/>      
      </div>
    );                                        
  }


  return (
    <Layout>
      <Carousel className={classes.mt1} animation="slide">
        {summary.map((product,inde) => (
          <NextLink
            key={inde}
            href='/'
            passHref
          >
            <Link>
              <img
                src={product.Banner}
                alt={product._id}
                className={classes.featuredImage}
                width="100%"
                height="400px"
              ></img>
            </Link>
          </NextLink>
        ))}
      </Carousel>
      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3} style={{display:"flex",justifyContent: "center",placeItems:"center"}}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name} style={{display:"flex",justifyContent: "center",placeItems: "center"}} >
            <ProductItem                                               
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();

  const topRatedProductsDocs = await Product.find({}, '-reviews')
    .lean()
    .sort({
      rating: -1,
    });
  await db.disconnect();
  return {
    props: {
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}
