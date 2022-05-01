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
import { getCurrentWalletConnected, connectWallet, getCurrentBalance, disconnectWallet } from '../../util/wallet'; 
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useWeb3 } from "@3rdweb/hooks";
import Loader from './../components/loader';
import Notification from '../components/notification';

const theme = createTheme();

export default function ConnectWallet() {
  const [loaderHidden, setLoaderHidden] = React.useState('none');

  const [ username, setUsername] = useState('');

  const [ code, setCode ] = useState('');

  const [ address, setAddress] = useState('');

  const [ balance, setBalance] = useState(0);

  const [status, setStatus] = useState("");

  const [payAndStartGameEnabled, setPayAndStartGameEnabled] = useState(0);

  const [ gamePrice, setGamePrice ] = useState(true);

  const [ disconnectButtonDisabled, setDisconnectButtonDisabled] = useState(true);

  const [trending, setTrending] = useState(0);

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

  const PayAndStartGame = async () => {
    setLoaderHidden('block');
    axios.post(`${process.env.API_URL}/game/pay/${code}/${address}`).then(res => {
      if(res.data.success) {
        Router.push('vote');
      } else {
        setLoaderHidden('none');
        setOpenNotify(true);
        setSeverity('warning');
        setMessage('Excuse me but go back and try again');
      }
    }); 
    // const web3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/VAaFI0iV-2W98yxBXPCtG9-OD1MCWIho");
    // const nonce = await web3.eth.getTransactionCount(address, 'latest');
    // const transaction = {
    //   'from': address,
    //   'to': "0x80e3fa88C8668E24Ee1b08C32b257BB5fB571A46", // faucet address to return eth
    //   'value': 1000000000000000000 * gamePrice / trending / 100,
    //   'gas': 30000,
    //   'maxPriorityFeePerGas': 1000000108,
    //   'nonce': nonce,
    //   // optional data field to send message or execute smart contract
    //   };

    //   //const signedTx = await web3.eth.accounts.signTransaction(transaction, "32ce8fded1a74e0d632c6a888d07bd81c6a80d742ca06bdf924b9456ca54c506");
    //   web3.eth.sendTransaction(transaction, function(error, hash) {
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

  }
  const Connect = async () => {
    const walletResponse = await connectWallet();
    setAddress(walletResponse.address);
    if(walletResponse.address != '') {
      let balance = await getCurrentBalance(walletResponse.address)
      setBalance(balance);
      setPayAndStartGameEnabled(false);
      setDisconnectButtonDisabled(false);
    } 
  }

  const Disconnect = async () => {
    disconnectWallet();
    let isDisconnected = await disconnectWallet();
    if(isDisconnected)
    {
      setDisconnectButtonDisabled(true);
      setAddress('');
      setBalance(0);
    }
  }
  
  useEffect(async () => {

    const GetStock = async () => {
      let res = await axios.get('https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=polygon&start=1&limit=1&category=spot&sort=cmc_rank_advanced');
      setTrending(res.data.data.marketPairs[0].price);
    }

    await GetStock();
    const isLogin = async () => {
      if(username === '')
      {
          let info = await GetUserInfo();
          // if(!info.success)
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
        setPayAndStartGameEnabled(false);
        setBalance(balance);
        setDisconnectButtonDisabled(false);
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
          setPayAndStartGameEnabled(false);
          setDisconnectButtonDisabled(false);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setPayAndStartGameEnabled(true);
          setDisconnectButtonDisabled(true);
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
          res = await axios.get(`${process.env.API_URL}/game/getamount/${res.data.user.code.substring(0, 4)}`); // get amount of the game
          setGamePrice(res.data)
          
        }
          
        else // in case of admin
        {
          res = await axios.get(`${process.env.API_URL}/game/getcode/${username_temp}`);
          //console.log(res)
          let temp_code = res.data.code;
          if(temp_code.length < 5)
            temp_code += "00";
          setCode(temp_code);
          setGamePrice(res.data.amount)
          
        }
        
        return {
          success: true,
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
          <Loader hidden={loaderHidden} />
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Button
              fullWidth
              onClick={() => {
                Connect();
                Connect();
              }}
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
              onClick={Disconnect}
              disabled={disconnectButtonDisabled}
            >
              Disconnect Wallet
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
        <Notification open={openNotify} message={message} severity={severity} handleClose={notifyHandleClose} />  
      </Container>
    </ThemeProvider>
  );
}