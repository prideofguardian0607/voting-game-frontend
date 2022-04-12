import * as React from 'react';

import { ThirdwebProvider } from "@3rdweb/hooks";

import "regenerator-runtime/runtime";
import { useWeb3 } from "@3rdweb/hooks"

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Router from 'next/router';
import axios from 'axios';
import Navbar from '../components/navbar';


const theme = createTheme();

export default function ConnectWallet() {

  const [ username, setUsername] = React.useState('');

  const [ code, setCode ] = React.useState('');
  // const { connectWallet, address, error } = useWeb3();

  const PayAndStartGame = () => {
    Router.push('vote');
  };

  const Connect = () => {
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
    if (token) {
      try {
        const res = await axios.get('http://localhost:5000/user/valid', {
          headers: {
            "x-access-token": token
          }
        });
        
        setUsername(res.data.user.username);
        setCode(res.data.user.code);
        return res.data.isLoggedIn;
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-access-token'];
      return false;
    }
  }

  const codeElement = () => {
    <Typography component="h3" variant="h5">
      {code}
    </Typography>
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar title="Connect Wallet" username={username}  />
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
          {codeElement}
          
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