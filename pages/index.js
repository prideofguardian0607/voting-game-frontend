import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Router from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

const theme = createTheme();

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    location.href = 'denomination';

    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

   useEffect(() => {
     localStorage.setItem('title', 'ADMIN');
  //   const GetStock = async () => {
  //     let response;
  //     try {
  //       response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD', {
  //         headers: {
  //           'X_CMC_PRO_API_KEY': 'ab321ac9-d05e-4fbd-be49-d1dc83abf80d',
  //           'Access-Control-Allow-Origin': '*'
  //         },
  //       });
  //       console.log(response)

  //     } catch(ex) {
  //       response = null;
  //       // error
  //       console.log(ex);

  //     }

  //     // let stock = await axios.get('https://api.coinmarketcap.com/data-api/v3/price-prediction/query/half-year?cryptoId=3890');
  //     // let stock = await axios.get('https://api.coinmarketcap.com/data-api/v3/price-prediction/query/half-year?cryptoId=3890');
  //     // let stock = await axios.get('wss://coinranking.com/api/real-time/rates');
  //     // console.log(stock);
  //   }

  //   GetStock();
   }, [])


  const information = [
    {
      url: 'play',
      displayText: 'HOW TO PLAY DEMO'
    },
    {
      url: 'buy',
      displayText: 'HOW TO BUY CRYPTO'
    },
    {
      url: 'connect',
      displayText: 'HOW TO CONNECT WALLET'
    },
    {
      url: '/signin',
      displayText: 'CREATE NEW GAME'
    },
    // {
    //   url: '/connectwallet',
    //   displayText: 'LOG INTO EXISTING GAME'
    // },
  ];

  const LogIntoGame = () => {
    //location.href = 'signin';
    localStorage.setItem('title', 'PLAYER');
    Router.push('signin')
  };
  console.log(process.env.API_URL)

  return (
    <ThemeProvider theme={theme}>
      <Typography component="h1" sx={{color: 'black', textAlign: 'center', paddingTop: "5%"}} variant="h1">
        <b>PLAY TO EARN GAME</b>
      </Typography>
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

          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {
                information.map((info, index) => (
                  <Grid key={index} item xs={12}>
                    <Link href={info.url}>
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 2, mb: 2 }}
                      >
                          {info.displayText}
                      </Button>
                    </Link>
                  </Grid>
                ))
              }
              <Grid item xs={12}>
                <Button
                  onClick={LogIntoGame}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                >
                    Log Into Game
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}