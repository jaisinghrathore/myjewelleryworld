import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer,useState } from 'react';
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import { useSnackbar } from 'notistack';


function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminOrders() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  const[init,upda] = useState('');

  const fetchData = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/orders`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    fetchData();
  }, []);


   const delivered = async(id) => {
    const a = confirm("Confirm")
    if(a){
      closeSnackbar();
    try {
      const { data } = await axios.put(`/api/admin/orders/delivered`,
      {id},
      {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if(data){
        fetchData();
      }else{
      enqueueSnackbar("Not Deleted", { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }

    }
  }

  return (
    <Layout title="Orders">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/banners" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Banners"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Orders
                </Typography>
              </ListItem>

                <ListItem>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography className={classes.error}>{error}</Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>USER</TableCell>
                            <TableCell>DATE</TableCell>
                            <TableCell>TOTAL</TableCell>
                            <TableCell>PAID</TableCell>
                            <TableCell>DELIVERED</TableCell>
                            <TableCell>ACTION</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>{order._id.substring(20, 24)}</TableCell>
                              <TableCell>
                                {order.user ? order.user.name : 'DELETED USER'}
                              </TableCell>
                              <TableCell>{order.createdAt}</TableCell>
                              <TableCell>₹{order.totalPrice}</TableCell>
                              <TableCell>
                                {order.isPaid
                                  ? `paid at ${order.paidAt}`
                                  : 'not paid'}
                              </TableCell>
                              <TableCell>
                                {order.isDelivered
                                  ? `delivered at ${order.deliveredAt}`
                                  : 'not delivered'}
                              </TableCell>
                              <TableCell>
                                <NextLink href={`/order/${order._id}`} passHref>
                                  <Button variant="contained">Details</Button>
                                </NextLink>
                                <Button onClick={()=>delivered(order._id)} variant="contained" color="secondary" >Delivered</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
