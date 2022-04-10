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
import axios from 'axios'

const theme = createTheme();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function SignIn() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    if(username == ''){
      setOpen(true);
      setMessage('You must enter the username');
    }else if(password == '') {
      setOpen(true);
      setMessage('You must enter the password');
    }else{
      axios.post(`http://localhost:5000/user/signin/${ username }/${ password }`,
		)
		  .then(res => {
        if(res.data.success === 'super'){
          location.href = 'admin';
        }else{
          if(res.data == '') {
            setOpen(true);
            setMessage('Invalid User');
          }
          else {
            location.href = 'denomination';
          }
        }
		  })
    }

    
	  
    

    // const res = await fetch('/api/auth/signin', {
    //   method: 'POST',
    //   headers: {
    //       'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //       username: data.get('username'),
    //       password: data.get('password'),
    //   }),
    // });

    // const result = await res.json();
    // if(res.status == 200){
    //   location.href = 'denomination';
    // }else{
    //   setOpen(true);
    //   setMessage(result.message);
    // }

    localStorage.setItem('username', data.get('username'));
  };

  const [message, setMessage] = React.useState('');

  const [open, setOpen] = React.useState(false);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
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
              required
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              required
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
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}