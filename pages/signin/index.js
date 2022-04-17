import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Notification from '../components/notification';
import axios from 'axios'
import Router from 'next/router'

const theme = createTheme();


export default function SignIn() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    
    if(username == ''){
      setOpenNotify(true);
      setSeverity('warning');
      setMessage('You must enter the username');
    }else if(password == '') {
      setOpenNotify(true);
      setSeverity('warning');
      setMessage('You must enter the password');
    }else if(password.length < 6){
      setOpenNotify(true);
      setSeverity('warning');
      setMessage('Password must be at least 6 digits');
    }else{
      axios.post(`${process.env.API_URL}/user/signin/${ username }/${ password }`
		  )
		  .then(res => {
        
        if(res.data.success === 'super'){ // in case of user is super admin
          
          localStorage.setItem('token', res.data.token)
          Router.push('/admin');
        }else{
          if(res.data.success === 'player') { // in case of user is player
            
            localStorage.setItem('token', res.data.token)
            Router.push('/connectwallet')
          }
          else if(res.data.success === 'admin') { // in case of user is admin
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            Router.push('/denomination')
          } else if(res.data.success === 'started') {
            setOpenNotify(true);
            setSeverity('warning');
            setMessage('The game has already started.');
          } else {
            setOpenNotify(true);
            setSeverity('warning');
            setMessage('Invalid user');
          }
        }
		  })
    }

  };
// validation
  React.useEffect(async () => {
    let info = await GetUserInfo();
    
    if(info.isLoggedIn) {
      if(info.level == 'super') {
        Router.push('/admin');
      } else if(info.level == 'admin') {
        Router.push('/denomination');
      } else {
        Router.push('connectwallet');
      }
    }
      
  }, []);

  const GetUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('${process.env.API_URL}/user/valid', {
          headers: {
            "x-access-token": token
          }
        });
        console.log(res)
        return { isLoggedIn: res.data.isLoggedIn, level: res.data.user.level };
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-access-token'];
      return { isLoggedIn: false };
    }
  }


  //Notification handle
  const [message, setMessage] = React.useState('');

  const [openNotify, setOpenNotify] = React.useState(false);

  const [severity, setSeverity] = React.useState('success');

  const notifyHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenNotify(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Keeper Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Game User Name"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"

              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
                {/* <Link href="/signup">
                  <a>Register new keeper</a>
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/signup">
                  <a>Register new keeper</a>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Notification open={openNotify} message={message} severity={severity} handleClose={notifyHandleClose} />  
    </ThemeProvider>
  );
}