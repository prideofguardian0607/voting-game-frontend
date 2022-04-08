import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

  const LogIntoExistingGame = () => {
    location.href = 'signin';
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

          <Typography component="h1" variant="h5">
            Play to earn game
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {
                information.map(info => (
                  <Grid key={info.url} item xs={12}>
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
                    onClick={LogIntoExistingGame}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                >
                    Log into existing game
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