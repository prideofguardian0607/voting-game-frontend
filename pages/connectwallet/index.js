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

 


const theme = createTheme();

export default function ConnectWallet() {

  // const { connectWallet, address, error } = useWeb3();

  const PayAndStartGame = () => {
    location.href = '/vote';
  };

  const Connect = () => {

  }
  

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
          
          <Typography component="h1" variant="h5">
            Connect wallet
          </Typography>
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