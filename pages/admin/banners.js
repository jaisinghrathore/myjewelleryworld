import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
  CardContent,
  CardActions,
  TextField,
  Link,
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
import { Bar } from 'react-chartjs-2';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';


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

function Banners() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const[init,upda] = React.useState('');
  const[init2,upda2] = React.useState('');

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/banners`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data[0].bannerImages });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [init2]);


  const handleChange = (e) => {
    upda(e.target.value);
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/admin/banners',
      {
        banner:init
      },
      {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log(data)
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
    upda('');
    upda2(Math.random()*1000);
  };

  const handleDelete = async(id) => {
    closeSnackbar();
    try {
      const { data } = await axios.get(`/api/admin/banners/${id}`,
      {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if(data){
        upda2(Math.random()*1000);
      }else{
      enqueueSnackbar("Not Deleted", { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }

  }


  return (
    <Layout title="Admin Dashboard">
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
                <ListItem selected button component="a">
                  <ListItemText primary="Banners"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
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
            

            <form className={classes.form}>
          <Typography component="h1" variant="h1">
            Add Banners.
          </Typography>
          <List>
            <ListItem>
             
                  <TextField
                    name="banner"
                    variant="outlined"
                    fullWidth
                    id="banner"
                    value={init}
                    label="Add Banner"
                    onChange={handleChange}
                    inputProps={{ type: 'banner' }}
                  ></TextField>

            </ListItem>
            <ListItem>
              <Button variant="contained" type="submit" onClick={handleSubmit} fullWidth color="primary">
                Add
              </Button>
            </ListItem>
          </List>
        </form>
            </Card>



            <Card className={classes.section}>
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
                          <TableCell>Banner Url</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {summary.map((order) => (
                          <TableRow key={order._id}>
                          <TableCell>{order._id.substring(20, 24)}</TableCell>
                          <TableCell>{order.Banner.substring(0, 24)}</TableCell>
                            <TableCell>
                            <NextLink href={order.Banner} passHref>
                                <Button variant="contained" style={{marginRight:"10px"}}>Details</Button>
                            </NextLink>

                            
                                <Button color="secondary" variant="contained" onClick={()=>handleDelete(order._id)}>Delete</Button>
                            

                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </Card>

        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Banners), { ssr: false });


// {
//     headers: { authorization: `Bearer ${userInfo.token}` },
// }