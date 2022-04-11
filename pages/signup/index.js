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
import Notification from '../components/notification';
import axios from 'axios';
import Router from 'next/router'
  
  const theme = createTheme();
  
  
  

  export default function SignUp() {
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const username = data.get('username');
      const metausername = data.get('metausername');
      const password = data.get('password');
      const email = data.get('email');

      if(password.length < 6) {
        setMessage('Password must be min 6 digits.');
        setSeverity('warning')
        setOpen(true);
      } else {
        axios.post(`http://localhost:5000/user/signup/${ metausername }/${ username }/${ password }/${ email }`)
        .then(res => {
          if(res.data.success == true){
            setMessage('Email sent');
            setSeverity('success');
            setOpen(true);
            
          } else {
            setMessage('Email not sent'); 
            setSeverity('warning');
            setOpen(true);
          }
        })
        setTimeout(() => {
          Router.push('/');
        }, 2000);
      }

      
    };

    const [message, setMessage] = React.useState('');

    const [open, setOpen] = React.useState(false);

    const [severity, setSeverity] = React.useState('success');

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
              New Admin
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
                        label="Existing Game User Name"
                        name="username"
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Create New Password"
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
                      <TextField
                            required
                            fullWidth
                            id="adminusername"
                            label="Referred by Existing Admin Username"
                            name="adminusername"
                        />
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
          
          <Notification open={open} message={message} severity={severity} handleClose={handleClose} />

        </Container>
      </ThemeProvider>
    );
  }