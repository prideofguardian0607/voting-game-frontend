import * as React from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Router from 'next/router';
import axios from 'axios';
import Navbar from '../components/navbar';

import { useMoralis } from 'react-moralis';


const theme = createTheme();

export default function ConnectWallet() {

  const { authenticate, authError } = useMoralis();

  const [ username, setUsername] = React.useState('');

  const [ code, setCode ] = React.useState('');
  // const { connectWallet, address, error } = useWeb3();

  const PayAndStartGame = () => {
    axios.post(`http://localhost:5000/game/pay/${code}`).then(res => {
      if(res.data.success)
        Router.push('vote');
    })
    
  };

  const Connect = () => {
    authenticate();
  }
  
  React.useEffect(async () => {
    if(username === '')
    {
        let isLoggin = await GetUserInfo();
        
        // if(!isLoggin)
        //   Router.push('signin');
    }
          
  }, [username]);

  const GetUserInfo = async () => {
    const token = localStorage.getItem('token');
    let username_temp = '';
    if (token) {
      try {
        let res = await axios.get('http://localhost:5000/user/valid', {
          headers: {
            "x-access-token": token
          }
        });
        
        setUsername(res.data.user.username);
        username_temp = res.data.user.username;

        if(res.data.user.code) // in case of user
        {
          setCode(res.data.user.code);
        }
          
        else // in case of admin
        {
          res = await axios.get(`http://localhost:5000/game/getcode/${username_temp}`);
          console.log(res)
          let temp_code = res.data.code;
          if(temp_code.length < 5)
            temp_code += "00";
          setCode(temp_code);
        }
        return true;
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-access-token'];
      return false;
    }
  };

  let error;
  if(authError)
    error = (
      <Typography>
        {authError.message}
      </Typography>
    );


  return (
    <ThemeProvider theme={theme}>
      <Navbar title="Connect Wallet" username={`${username}(${code})`}  />
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
          
          <Typography component="h1" variant="h5">
            Connect wallet
          </Typography>
          { error }
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Button
              fullWidth
              onClick={Connect}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Connect wallet
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={PayAndStartGame}
            >
              Pay and start game
            </Button>
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}