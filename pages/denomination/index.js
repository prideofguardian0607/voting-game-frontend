import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Router from 'next/router';
import axios from 'axios'
import Navbar from '../components/navbar'
import Loader from './../components/loader';
import Notification from '../components/notification';

const theme = createTheme();

export default function Denomination() {
  const [loaderHidden, setLoaderHidden] = React.useState('none');
  const [color2, setColor2] = React.useState('primary');
  const [color5, setColor5] = React.useState('primary');
  const [color10, setColor10] = React.useState('primary');
  const [amount, setAmount] = React.useState(0);
  const [username, setUsername] = React.useState('');
  const [confirmAmountButtonEnabled, setConfirmAmountButtonEnabled] = React.useState(true);
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
  const SetAmount2 = () => {
    setAmount(2);
    setColor2('success');
    setColor5('primary');
    setColor10('primary');
    setConfirmAmountButtonEnabled(false);
  };

  const SetAmount5 = () => {
    setAmount(5);
    setColor2('primary');
    setColor5('success');
    setColor10('primary');
    setConfirmAmountButtonEnabled(false);
  
  }

  const SetAmount10 = () => {
    setAmount(10)
    setColor2('primary');
    setColor5('primary');
    setColor10('success');
    setConfirmAmountButtonEnabled(false);
  }

 // confirm amount and go to connect wallet page 
  const ConfirmAmount = () => {
    
    let current = new Date();
    
    let data = { username: username, code: GenerateCode(), amount: amount};
    setLoaderHidden('block');
    axios.post(`${process.env.API_URL}/game/create/${JSON.stringify(data)}`, ).then((res) => {
      if(res.data.success == true) {
        // setLoaderHidden('none');
        Router.push('connectwallet');
      } else {
        setLoaderHidden('none');
        setOpenNotify(true);
        setSeverity('warning');
        setMessage('Sorry but something went wrong. Please try again.');
      }
    })
    
  };

  const GenerateCode = () => {
    let current = new Date();
    let hour = '' + current.getHours();
    let min = '' + current.getMinutes();
    if(hour.length < 2)
      hour = '0' + hour;
    if(min.length < 2)
      min = '0' + min;
    return [min, hour].join('');
  }

// validate if the user login
  
  React.useEffect(async () => {
    if(username === '')
    {
        let isLoggin = await GetUserInfo();
        if(!isLoggin)
          Router.push('signin');
    }
          
  }, [username]);

  const GetUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get(`${process.env.API_URL}/user/valid`, {
          headers: {
            "x-access-token": token
          }
        });
        
        setUsername(res.data.user.username);
        return res.data.isLoggedIn;
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-access-token'];
      return false;
    }
  }

  return (
    <>
      <Navbar title="Game Denomination" username={username}  />
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
            <Loader hidden={loaderHidden} />
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={SetAmount2}
                color={color2}
              >
                2 $
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={SetAmount5}
                color={color5}
              >
                5 $
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={SetAmount10}
                color={color10}
              >
                10 $
              </Button>
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Own Amount"
                onChange={(e) => {
                  setAmount(e.target.value);
                  if(e.target.value > 0) {
                    setConfirmAmountButtonEnabled(false);
                  } else {
                    setConfirmAmountButtonEnabled(true);
                  }
                }}
                value={amount}
                autoComplete="current-password"
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={ConfirmAmount}
                disabled={confirmAmountButtonEnabled}
              >
                Confirm Amount
              </Button>
            </Box>
          </Box>
        </Container>
        <Notification open={openNotify} message={message} severity={severity} handleClose={notifyHandleClose} />  
      </ThemeProvider>    
    </>
  );
}