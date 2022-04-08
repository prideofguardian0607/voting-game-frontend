import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

  
  const theme = createTheme();
  
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

  export default function SignUp() {
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            metausername: data.get('metausername'),
            username: data.get('username'),
            password: data.get('password'),
            email: data.get('email'),
        }),
      });

      // const result = await res.json();
      // console.log(result);
      if(res.status === 201){
        setOpen(true);
        setMessage("YOUR APPLICATION HAS BEEN SENT TO BE VERIFIED, AN E-MAIL WILL BE SENT TO YOU NOTIFYING YOU IF YOUR APPLICATION HAS BEEN APPROVED");
        location.href = '/';
      }
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
              New User
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="metausername"
                        label="Facebook / Meta User Name"
                        name="metausername"
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="username"
                        label="Game User Name"
                        name="username"
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="E-Mail"
                        name="email"
                        autoComplete="email"
                    />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Refered by keeper username
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Link href='rule'>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Play to earn conditions
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={12}> 
                            <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="Have you read the conditions?"
                            />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Link href='/'>
                            <Button
                                
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Back
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Next
                        </Button>
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