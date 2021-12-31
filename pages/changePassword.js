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
  
  export default function Login() {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { token } = router.query; 

  
    const classes = useStyles();
    const submitHandler = async ({ password,Cpassword }) => {
        if(password === Cpassword){
      closeSnackbar();
      try {
        const data = await axios.post(`/api/forgetPassword/changePassword/?token=${token}`, {password,Cpassword});
        if(data){
            // console.log(data);
            router.push('/login');
        }else{
        enqueueSnackbar("Token doesn't match.", { variant: 'error' });
        }
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    }else{
        enqueueSnackbar("Password must be match.", { variant: 'error' });
    }
    
    };
    return (
      <Layout title="Login">
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
          <Typography component="h1" variant="h1">
          Change Password
          </Typography>
          <List>
          <ListItem>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="password"
                    label="Password"
                    inputProps={{ type: 'password' }}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password
                        ? errors.password.type === 'minLength'
                          ? 'Password length is more than 5'
                          : 'Password is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>

            <ListItem>
              <Controller
                name="Cpassword"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="Confirm password"
                    label="Confirm Password"
                    inputProps={{ type: 'Confirm password' }}
                    error={Boolean(errors.Cpassword)}
                    helperText={
                      errors.Cpassword
                        ? errors.Cpassword.type === 'minLength'
                          ? 'Password length is more than 5'
                          : 'Password is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>

            <ListItem>
              <Button variant="contained" type="submit" fullWidth color="primary">
                Change Password
              </Button>
            </ListItem>

          </List>
        </form>
      </Layout>
    );
  }
  