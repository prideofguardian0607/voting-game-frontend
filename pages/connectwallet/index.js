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
import { useState, useEffect } from 'react'
import { getCurrentWalletConnected, connectWallet, getCurrentBalance } from '../../util/wallet'; 
import { createAlchemyWeb3 } from "@alch/alchemy-web3"


const theme = createTheme();

export default function ConnectWallet() {

  const [ username, setUsername] = useState('');

  const [ code, setCode ] = useState('');

  const [ address, setAddress] = useState('');

  const [ balance, setBalance] = useState(0);

  const [status, setStatus] = useState("");

  const [payAndStartGameEnabled, setPayAndStartGameEnabled] = useState(true);

  const PayAndStartGame = async () => {
    axios.post(`${process.env.API_URL}/game/pay/${code}/${address}`).then(res => {
      if(res.data.success) {
        Router.push('vote');
      }
    });
    // const web3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/VAaFI0iV-2W98yxBXPCtG9-OD1MCWIho");
    // const nonce = await web3.eth.getTransactionCount(address, 'latest');
    // const transaction = {
    //   'from': address,
    //   'to': "0x80e3fa88C8668E24Ee1b08C32b257BB5fB571A46", // faucet address to return eth
    //   'value': 100000000000000000,
    //   'gas': 30000,
    //   'maxPriorityFeePerGas': 1000000108,
    //   'nonce': nonce,
    //   // optional data field to send message or execute smart contract
    //  };

    //  //const signedTx = await web3.eth.accounts.signTransaction(transaction, "32ce8fded1a74e0d632c6a888d07bd81c6a80d742ca06bdf924b9456ca54c506");
    //  web3.eth.sendTransaction(transaction, function(error, hash) {
    //     if (!error) { // if the transaction is successed
    //       console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    //       axios.post(`${process.env.API_URL}/game/pay/${code}/${address}`).then(res => {
    //         if(res.data.success) {
    //           Router.push('vote');
    //         }
    //       });
    //     } else {
    //       console.log("❗Something went wrong while submitting your transaction:", error);
    //       return false;
    //     }
    //   });
  };

  

  const Connect = async () => {
    const walletResponse = await connectWallet();
    setAddress(walletResponse.address);
    if(address !== '') {
      let balance = await getCurrentBalance(walletResponse.address)
      setBalance(balance);
      setPayAndStartGameEnabled(false);
    } else {
      setPayAndStartGameEnabled(true);
    }
  }
  
  useEffect(async () => {

    const GetStock = async () => {
      let response;
      try {
        response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD', {
          headers: {
            'X_CMC_PRO_API_KEY': 'ab321ac9-d05e-4fbd-be49-d1dc83abf80d',
          },
        });
        console.log(response)

      } catch(ex) {
        response = null;
        // error
        console.log(ex);

      }

      // let stock = await axios.get('https://api.coinmarketcap.com/data-api/v3/price-prediction/query/half-year?cryptoId=3890');
      // let stock = await axios.get('https://api.coinmarketcap.com/data-api/v3/price-prediction/query/half-year?cryptoId=3890');
      // let stock = await axios.get('wss://coinranking.com/api/real-time/rates');
      // console.log(stock);
    }

    await GetStock();
    const isLogin = async () => {
      if(username === '')
      {
          let isLoggin = await GetUserInfo().success;
          // if(!isLoggin)
          //   Router.push('signin');
      } 
    };
    isLogin(); 
  }, [username]);

  useEffect(() => {

    const fetchWallet = async () => {
      const {address, status} = await getCurrentWalletConnected();
      setAddress(address);
      setStatus(status); 
      if(address !== '') {
        let balance = await getCurrentBalance(address)
        setBalance(balance);
        setPayAndStartGameEnabled(false);
      } else {
        setPayAndStartGameEnabled(true);
      }
    }
    fetchWallet();
    addWalletListener();
  }, []);

  function addWalletListener() { //TODO: implement
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          
          let balance = await getCurrentBalance(accounts[0]);
          setBalance(balance);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setAddress("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }    
  }

  const GetUserInfo = async () => {
    const token = localStorage.getItem('token');
    let username_temp = '';
    if (token) {
      try {
        let res = await axios.get(`${process.env.API_URL}/user/valid`, {
          headers: {
            "x-access-token": token
          }
        });
        //console.log(res)
        setUsername(res.data.user.username);
        username_temp = res.data.user.username;

        if(res.data.user.code) // in case of user
        {
          setCode(res.data.user.code);
        }
          
        else // in case of admin
        {
          res = await axios.get(`${process.env.API_URL}/game/getcode/${username_temp}`);
          //console.log(res)
          let temp_code = res.data.code;
          if(temp_code.length < 5)
            temp_code += "00";
          setCode(temp_code);
        }
        return {
          success: true,
          amount: res.data.amount
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-access-token'];
      return {
        success: true,
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar title="Connect Wallet" username={`${username}(${code})`}  />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Typography>
          {/* {status} */}
        </Typography>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Button
              fullWidth
              onClick={Connect}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {
                String(address).length > 0 ? String(address).substring(0, 6) 
                + "..." 
                + String(address).substring(38) + "(" + parseFloat(balance).toFixed(3) + "MATIC )" : "Connect Wallet"
              }
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={PayAndStartGame}
              disabled={payAndStartGameEnabled}
            >
              Pay and start game
            </Button>
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}