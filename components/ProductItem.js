import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Grid, Link 
} from '@material-ui/core';
import React from 'react';
import NextLink from 'next/link';
import Rating from '@material-ui/lab/Rating';
import Carousel from 'react-material-ui-carousel';



export default function ProductItem({ product, addToCartHandler }) {
  return (
    <Card style={{width:'303px'}}>
      <NextLink href={`/product/${product.slug}`} passHref>
        <CardActionArea>
          {/* <CardMedia
            component="img"
            image={product.image[1]}
            title={product.name}
          ></CardMedia> */}
          <Carousel animation="slide" fullHeightHover={false} navButtonsAlwaysVisible={false} autoPlay={true} stopAutoPlayOnHover={false} indicators={false} interval={3000}  NextIcon={<></>} PrevIcon={<></>} >
        {product.image.map((product,index) => (
              <img
                key={index}
                src={product}
                alt={product._id}
                style={{height:'300px',width:'100%',objectFill:'fill'}}
              ></img>
        ))}
      </Carousel>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>₹{product.price}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
