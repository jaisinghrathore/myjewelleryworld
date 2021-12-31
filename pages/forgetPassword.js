import {
    List,
    ListItem,
    Typography,
    TextField,
    Button,
    Link,
  } from '@material-ui/core';
  import axios from 'axios';
  import { useRouter } from 'next/router';
  import NextLink from 'next/link';
  import React, { useContext, useEffect } from 'react';
  import Layout from '../components/Layout';
  import { Store } from '../utils/Store';
  import useStyles from '../utils/styles';
  import Cookies from 'js-cookie';
  import { Controller, useForm } from 'react-hook-form';
  import { useSnackbar } from 'notistack';
  import { getError } from '../utils/error';
  
  export default function forgetPassword() {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    useEffect(() => {
      if (userInfo) {
        router.push('/');
      }
    }, []);
  
    const classes = useStyles();
    const submitHandler = async ({ email }) => {
      closeSnackbar();
        try {
        const {data} = await axios.post('/api/forgetPassword', {
          email,
        });
        if(data){
        // router.push(`/api/verifyToken/?token=${data}`);
        router.push(`verifyToken/?token=${data}`);
        }
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    };
    return (
      <Layout title="Login">
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form} style={{marginTop:"10%"}} >
          <Typography component="h1" variant="h1">
            Forget Password
          </Typography>
          <List>
            <ListItem>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email"
                    inputProps={{ type: 'email' }}
                    error={Boolean(errors.email)}
                    helperText={
                      errors.email
                        ? errors.email.type === 'pattern'
                          ? 'Email is not valid'
                          : 'Email is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Button variant="contained" type="submit" fullWidth color="primary">
                Proceed
              </Button>
            </ListItem>
          </List>
        </form>
      </Layout>
    );
  }
  