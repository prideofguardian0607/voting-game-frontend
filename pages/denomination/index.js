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

const theme = createTheme();

export default function Denomination() {

  const [color2, setColor2] = React.useState('primary');
  const [color5, setColor5] = React.useState('primary');
  const [color10, setColor10] = React.useState('primary');
  const [amount, setAmount] = React.useState(0);
  const [username, setUsername] = React.useState('');

  const SetAmount2 = () => {
    setAmount(2);
    setColor2('success');
    setColor5('primary');
    setColor10('primary');

  };

  const SetAmount5 = () => {
    setAmount(5);
    setColor2('primary');
    setColor5('success');
    setColor10('primary');
  
  }

  const SetAmount10 = () => {
    setAmount(10)
    setColor2('primary');
    setColor5('primary');
    setColor10('success');
  }

 // confirm amount and go to connect wallet page 
  const ConfirmAmount = () => {
    
    let current = new Date();
    
    let data = { username: username, code: GenerateCode(), amount: amount};

    axios.post(`http://localhost:5000/game/create/${JSON.stringify(data)}`, ).then((res) => {
      if(res.data.success == true) {
        Router.push('connectwallet');
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
        const res = await axios.get('http://localhost:5000/user/valid', {
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Game denomination
            </Typography>
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
                  setAmount(e.target.value)
                }}
                value={amount}
                autoComplete="current-password"
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={ConfirmAmount}
              >
                Confirm Amount
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>    
    </>
  );
}