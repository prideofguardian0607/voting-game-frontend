import Link from "next/link";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import React from 'react';
import Router from 'next/router';
import axios from 'axios';
import Navbar from '../components/navbar';

let socket

export default function Vote() {

  const [ username, setUsername ] = React.useState('');
  const [ code, setCode ] = React.useState('');

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
        setCode(res.data.user.code);
        return res.data.isLoggedIn;
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      return false;
    }
  }

  return (
      <>
        <Navbar title="Vote" username={username}  />
      </>
  )
}

