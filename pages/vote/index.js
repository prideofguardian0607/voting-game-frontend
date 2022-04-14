import Link from "next/link";
import Typography from '@mui/material/Typography'
import React from 'react';
import Router from 'next/router';
import axios from 'axios';
import Navbar from '../components/navbar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import Notification from '../components/notification'


export default function Vote() {

  const [ username, setUsername ] = React.useState('');
  const [ code, setCode ] = React.useState('');
  const [ gameinfo, setGameInfo ] = React.useState([]);

  const [ totalPrice, setTotalPrice ] = React.useState(0);
  const [ priceHidden, setPriceHidden] = React.useState('none');

  const [ startButtonDisabled, setStartButtonDisabled] = React.useState(true);
  const [ startButtonHidden, setStartButtonHidden] = React.useState('block');

  const [ level, setLevel ] = React.useState('player');
  const [isGameStarted, setIsGameStarted] = React.useState(false);

  const [ previousVotedIndex, setPreviousVotedIndex ] = React.useState(-1);
  

  React.useEffect(async () => {
    if(username === '')
    {
      let info = await GetUserInfo();
      if(!info.isLoggedIn)
        Router.push('signin');
      
    }
    
  }, []);

  const GetUserInfo = async () => {
    const token = localStorage.getItem('token');
    let username_temp = '';
    let temp_isLogin = false;
    let temp_code = '';
    let temp_level = 'player';
    
    if (token) {
      try {
        let res = await axios.get('http://localhost:5000/user/valid', {
          headers: {
            "x-access-token": token
          }
        });
        
        setUsername(res.data.user.username);
        username_temp = res.data.user.username;
        temp_isLogin = res.data.isLoggedIn;
        setLevel(res.data.user.level);
        temp_level = res.data.user.level;
        console.log(level)
        

        if(res.data.user.code) // in case of user
        {
          
          setCode(res.data.user.code);
          temp_code = res.data.user.code;
        } 
        else // in case of admin
        {
          res = await axios.get(`http://localhost:5000/game/getcode/${username_temp}`);
          temp_code = res.data.code;
          if(temp_code.length < 5)
            temp_code += "00";
          setCode(temp_code);
          
        }

        // get the players information 
        setInterval(() => {
          axios.get(`http://localhost:5000/game/getplayers/${temp_code.substring(0, 4)}`).then(res => {
            
            let players = res.data.players;
            if(res.data.isStarted)
            {
              setStartButtonHidden('none');
              setIsGameStarted(true);
              setPriceHidden('block');
            }
            

            // set disable start button
            let sum = 0;
            players.map(player => {
              if(player.isPay)
              {
                sum ++;
              }
            })

            if(sum > 5) {
              if(temp_level == 'admin')
              { 
                setStartButtonDisabled(false);
              }  
            }

            // get total amount
            setTotalPrice((sum - 1) * res.data.amount);

            // sort by code order

            players.sort((a, b) => {
              return parseInt(a.code.substring(4, 6)) - parseInt(b.code.substring(4, 6));
            });

            // order handle
            let blank_state = [false, false, false, false, false, false, false, false];
            players.map((player) => {
              blank_state[parseInt(player.code.substring(4, 6))] = true;
            });

            blank_state.map((state, index) => {
              if(!state)
                players.splice(index, 0, null);
            });

            setGameInfo(players)

          });
        }, 1000);

        return { isLoggedIn: temp_isLogin, code: temp_code };

      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-access-token'];
      return {isLoggedIn: false};
    }
  }

  const Counter = () => {

  };

  //start game

  const StartGame = async () => {
    if(level == 'admin')
    {
      // set the start game flag
      axios.post(`http://localhost:5000/game/start/${code.substring(0, 4)}/${username}`).then(res => {
        if(res.data.success) {
          
          // show the winning pools
          setPriceHidden('block');
          setIsGameStarted(true);
          
        }
      });
    }
  };

  // Vote

  const Vote = (index) => {
    
    if(isGameStarted) { // if the game starts
      let players = gameinfo;
      // validate if you have right to vote
      let you = players.filter(player => {
        if(player)
          return player.code == code && ( player.voted[0] == '' || player.voted[1] == '' || player.voted[2] == '');
        return false;
      });

      if(you.length == 0) { // if you have no right to vote
        setMessage("You have no right to vote.");
        setSeverity('warning');
        setOpenNotify(true);
      } else { // if you have right to vote
        if(players[index].voted[0] != '' && players[index].voted[1] != '' && players[index].voted[2] != '') { // if the player has been kicked from the game
          setMessage("This player has been kicked from the game.");
          setSeverity('warning');
          setOpenNotify(true);                     
        } else {
          if(level == 'admin') // if the user is admin
          {
            if(previousVotedIndex == -1) { // in case of the admin's first vote
              setPreviousVotedIndex(index);
    
              players[index].voted[0] = username; // admin votes the player
            } else { 
              if(!players[previousVotedIndex].voted[1] && !players[previousVotedIndex].voted[2]) { // if the player is not voted by other players
                players[previousVotedIndex].voted[0] = '';
                players[index].voted[0] = username; // admin votes the player
                setPreviousVotedIndex(index);
              } else { // if the player has already been voted by other players
                setMessage("You can't change the vote.");
                setSeverity('warning');
                setOpenNotify(true);
              }
            }
          } else { // if the user is player
            if(players[index].voted[0] != '') { // if the player is voted by admin
              if(players[index].voted[1] == username || players[index].voted[2] == username) { // if the player is voted by you
                setMessage("You have already voted this player.");
                setSeverity('warning');
                setOpenNotify(true);
              } else {
                if(players[index].voted[1] != '') { // if the first vote is done.
                  players[index].voted[2] = username; 
                } else {
                  players[index].voted[1] = username; 
                }
              }
            } else { // in case that the player is not voted by admin
              setMessage("This player is not voted by admin yet.");
              setSeverity('warning');
              setOpenNotify(true);
            }
          }           
        }
  
        // update the game state 
        axios.post(`http://localhost:5000/game/vote/${ JSON.stringify({ code: code.substring(0, 4), players: players.filter(player => {
            return player != null 
          })}) }`).then(res => {
          if(res.data.success) {
            setGameInfo(players);
          }
        });
      }  
    } else { // if the game has not started yet.
      setMessage("The game has not started yet.");
      setSeverity('warning');
      setOpenNotify(true);
    }
  }

  // positions of seat

  const positions = [
    {y: '30%', x: '79%'},
    {y: '15%', x: '58%'},
    {y: '15%', x: '37%'},
    {y: '30%', x: '16%'},
    {y: '65%', x: '16%'},
    {y: '80%', x: '37%'},
    {y: '80%', x: '58%'},
    {y: '65%', x: '79%'},
  ];

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

  return (
      <>
        <Navbar title="Vote" username={`${username}(${code})`}  />
        {
          positions.map((pos, index) => {
            let seat;
            let temp_code = '';
            let temp_username = '';
            let color = 'gray';
            let hidden = true;

            if(gameinfo[index] != null)
            {
              temp_code = gameinfo[index].code;
              temp_code = `${temp_code.slice(0, 4)}(${temp_code.slice(4, 6)})`
              temp_username = gameinfo[index].username;
              if(gameinfo[index].isPay && !(gameinfo[index].voted[0] != '' && gameinfo[index].voted[1] != '' && gameinfo[index].voted[2] != ''))
              {
                color = 'green';
                hidden = false;
              } 
              
              seat = (
                <Card onClick={() => {
                  Vote(index)
                }} key={index} sx={{ width: '8%', height: '8%', backgroundColor:  color, position: 'absolute', top: pos.x, left: pos.y }}>             
                  <Box
                    sx={{
                      width: '50%',
                      height: '100%',
                      position: 'absolute',
                      backgroundColor: 'error.dark',
                      display: gameinfo[index].voted[0] != '' && !hidden ? 'block' : 'none'
                    }}
                  />
                  <Box
                    sx={{
                      width: '50%',
                      height: '50%',
                      position: 'absolute',
                      left: '50%',
                      backgroundColor: 'error.dark',
                      display: gameinfo[index].voted[1] != ''  && !hidden ? 'block' : 'none'
                    }}
                  />
                  <Box
                    sx={{
                      width: '50%',
                      height: '50%',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      backgroundColor: 'error.dark',
                      display: gameinfo[index].voted[2] != ''  && !hidden ? 'block' : 'none'
                    }}
                  />
                  <Typography variant="div" sx={{position: 'absolute', top: '20%', left: '15%'}} >
                    { temp_username }
                  </Typography>
                  <br></br>
                  <Typography sx={{position: 'absolute', top: '50%', left: '15%'}}>
                  { temp_code }
                  </Typography>
                </Card>
                )
            }

            return seat;
          })

        }
        <Card sx={{ minWidth: '50%', minHeight: '40%', borderRadius: '50%', position: 'absolute', top: '30%', left: '25%' }}>
          <Typography sx={{ display: priceHidden, position: 'absolute', left: '45%',top: '25%'}} variant='h4'>
            1st: {totalPrice * 0.5}
          </Typography>
          <Typography sx={{ display: priceHidden, position: 'absolute', top: '45%', left: '45%'}} variant='h4'>
            2nd:{totalPrice * 0.3}
          </Typography>
          <Typography sx={{ display: priceHidden, position: 'absolute', top: '65%', left: '45%'}} variant='h4'>
            3rd:{totalPrice * 0.2}
          </Typography>
        </Card>
        <Button onClick={StartGame} variant='contained' disabled={startButtonDisabled} size="large" color='success'  sx={{ display: startButtonHidden, minWidth: '10%', minHeight: '10%',position: 'absolute', bottom: '10%', left: '45%', alignItems: 'center', justify: 'center' }}>
            Start Game
        </Button>        
        
        <Notification open={openNotify} message={message} severity={severity} handleClose={notifyHandleClose} />
      </>
  )
}

