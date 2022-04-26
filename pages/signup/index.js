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
import {useState, useEffect} from 'react';
  
const theme = createTheme();

export default function SignUp() {

  const [metausername, setMetaUserName] = useState('');
  const [gameusername, setGameUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [referredby, setReferredby] = useState('');
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const GetRegisterInfo = async () => {
      let data = JSON.parse(localStorage.getItem('register_info'));
      if(data != null) {
        setMetaUserName(data[1]);
        setGameUserName(data[0]);
        setPassword(data[2]);
        setEmail(data[3]);
        setReferredby(data[4]);
        setIsRead(data[5]);
      }
    };
    GetRegisterInfo();
  }, []);

  const IsValid = () => {
    if (metausername === '') {
        setMessage('Meta Username is required.');
        setOpen(true);
        setSeverity('warning');
        return false;
    } else if (gameusername === '') {
        setMessage('Game Username is required.');
        setOpen(true);
        setSeverity('warning');
        return false;
    }else if(password.length < 6) {
        if(password.length == 0){
            setMessage('Password is required.');
            setOpen(true);
            setSeverity('warning');
        } else {
            setMessage('Password must be at least 6 digits.');
            setOpen(true);
            setSeverity('warning');
        }
        return false;
    } else if( email === ''){
        setMessage('Email is required.');
        setOpen(true);
        setSeverity('warning');
        return false;
    } else if( !email.includes('@') ) {
        setMessage('Invalid Email');
        setOpen(true);
        setSeverity('warning');
        return false;
    } else if( referredby === ''){
        setMessage('Referredby is required.');
        setOpen(true);
        setSeverity('warning');
        return false;
    }
    return true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();    
    if(IsValid()) {
      axios.post(`${process.env.API_URL}/user/signup/${ metausername }/${ gameusername }/${ password }/${ email }/${referredby}`)
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
      });
      // setTimeout(() => {
      //   Router.push('/');
        
      // }, 2000);
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
                      onChange={(e) => {
                        setMetaUserName(e.target.value);
                        localStorage.setItem('register_info', JSON.stringify([gameusername, e.target.value, password, email, referredby, isRead ]));
                    }}
                    value={metausername}
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="username"
                      label="Existing Game User Name"
                      name="username"
                      onChange={(e) => {
                        setGameUserName(e.target.value);
                        localStorage.setItem('register_info', JSON.stringify([e.target.value, metausername, password, email, referredby, isRead ]));
                    }}
                    value={gameusername}
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        localStorage.setItem('register_info', JSON.stringify([gameusername, metausername, e.target.value, email, referredby, isRead ]));
                      }}
                      value={password}  
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
                        onChange={(e) => {
                          setEmail(e.target.value);
                          localStorage.setItem('register_info', JSON.stringify([gameusername, metausername, password, e.target.value, referredby, isRead ]));
                        }}
                        value={email}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                          required
                          fullWidth
                          id="adminusername"
                          label="Referred by Existing Admin Username"
                          name="adminusername"
                          onChange={(e) => {
                            setReferredby(e.target.value);
                            localStorage.setItem('register_info', JSON.stringify([gameusername, metausername, password, email, e.target.value, isRead ]));
                          }}
                          value={referredby}
                      />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={() => {
                          localStorage.setItem('register_info',JSON.stringify([gameusername, metausername, password, email, referredby, true]));
                          Router.push('rule');
                        }}
                    >
                        Play to earn conditions
                    </Button>
                  </Grid>
                  <Grid item xs={12}> 
                          <FormControlLabel
                          control={<Checkbox value="allowExtraEmails" checked={isRead} onChange={e => {
                            setIsRead(isRead => !isRead);
                            localStorage.setItem('register_info',JSON.stringify([gameusername, metausername, password, email, referredby, isRead]));
                            }
                          } color="primary" />}
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
                          onClick={() => {
                            localStorage.removeItem('register_info');
                          }}
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