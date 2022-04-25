import Link from "next/link";
import Typography from '@mui/material/Typography'
import React, { useRef } from 'react';
import Router from 'next/router';
import axios from 'axios';
import Navbar from '../components/navbar';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import Notification from '../components/notification';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createAlchemyWeb3 } from "@alch/alchemy-web3"

export default function Vote() {

  const [ username, setUsername ] = React.useState('');
  const [ code, setCode ] = React.useState('');
  const [ gameinfo, setGameInfo ] = React.useState([]);

  const [ totalPrice, setTotalPrice ] = React.useState(0);
  const [ priceHidden, setPriceHidden] = React.useState('none');

  const [ startButtonDisabled, setStartButtonDisabled] = React.useState(true);
  const [ startButtonHidden, setStartButtonHidden] = React.useState('block');

  const level = useRef('player');
  const [isGameStarted, setIsGameStarted] = React.useState(false);

  const [winningOrder, SetWinningOrder] = React.useState([]);

  const previousVotedIndex = useRef(-1);

  const TIMEOUT_LIMIT = 600;
  const TIMEOUT_LIMIT_GAME = 5;
  const PLAYER_LIMIT = 2;
  const winning_rate = [0.5, 0.3, 0.2];

  const timer = useRef(null);
  const gametimeHandler = useRef(null);

  const players = useRef(null);
  
  const Pay = async (to, amount) => {
    const web3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/VAaFI0iV-2W98yxBXPCtG9-OD1MCWIho");
    const nonce = await web3.eth.getTransactionCount('0x80e3fa88C8668E24Ee1b08C32b257BB5fB571A46', 'latest'); // admin address
    const transaction = {
      'to': to, // faucet address to return eth
      'value': amount * 1000000000000000000,
      'gas': 30000,
      'maxPriorityFeePerGas': 1000000108,
      'nonce': nonce,
      // optional data field to send message or execute smart contract
     };

     const signedTx = await web3.eth.accounts.signTransaction(transaction, "b3bd71adb864913dd69fb8649e21b97c2193c6431206165de5f9e7a21d931ea0");
     web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error) {
          console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
          return true;
        } else {
          console.log("❗Something went wrong while submitting your transaction:", error);
          return false;
        }
      });
  };

  React.useEffect(async () => {
    if(username === '')
    {
      let info = await GetUserInfo();
      if(!info.isLoggedIn)
        Router.push('signin');
    }
    
  }, [username]);

  const GetUserInfo = async () => {
    const token = localStorage.getItem('token');
    let username_temp = '';
    let temp_isLogin = false;
    let temp_code = '';
    
    if (token) {
      try {
        let res = await axios.get(`${process.env.API_URL}/user/valid`, {
          headers: {
            "x-access-token": token
          }
        });
        
        setUsername(res.data.user.username);
        username_temp = res.data.user.username;
        temp_isLogin = res.data.isLoggedIn;
        level.current = res.data.user.level;

        if(res.data.user.code) // in case of user
        {
          
          setCode(res.data.user.code);
          temp_code = res.data.user.code;
        } else // in case of admin
        {
          res = await axios.get(`${process.env.API_URL}/game/getcode/${username_temp}`);
          temp_code = res.data.code;
          if(temp_code.length < 5)
            temp_code += "00";
          setCode(temp_code);
        }

        // get the players information 
        gametimeHandler.current = setInterval(async () => {
          axios.get(`${process.env.API_URL}/game/getplayers/${temp_code.substring(0, 4)}`).then(res => {
            let temp_players = players.current = res.data.players;
            if(res.data.isStarted)
            {
              setStartButtonHidden('none');
              setIsGameStarted(true);
              setPriceHidden('block');
            }
            // set disable start button
            let sum = 0;
            temp_players.map(player => {
              if(player.isPay)
              {
                sum ++;
              }
            })
            
            if(sum > PLAYER_LIMIT) {
              if(level.current == 'admin')
              { 
                setStartButtonDisabled(false);
              }  
            }

            // get total amount
            let temp_totalAmount = (sum - 1) * res.data.amount;
            setTotalPrice((sum - 1) * res.data.amount);

            // sort by code order
            
            temp_players.sort((a, b) => {
              return parseInt(a.code.substring(4, 6)) - parseInt(b.code.substring(4, 6));
            });

            // order handle
            let blank_state = [false, false, false, false, false, false, false, false];
            temp_players.map((player) => {
              blank_state[parseInt(player.code.substring(4, 6))] = true;
            });

            blank_state.map((state, index) => {
              if(!state)
                temp_players.splice(index, 0, null);
            });
            
            setGameInfo(temp_players);
            
            if(res.data.isEnded) { // if the game ends
              clearInterval(gametimeHandler.current);
              let filter_result = res.data.players.filter(player => player != null);

              let order_result = filter_result.sort((a, b) => a.order - b.order);
              SetWinningOrder(order_result);
              if(level.current == 'admin') {
                // send the winning pool to winners

                for(let i = 0;i < 3;i ++) {
                  Pay(order_result[i].address, temp_totalAmount * winning_rate[i] / 1.36 / 100);
                }
              }

              setOpenDialog(true);
            }
          });
        }, 500);

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
    let time = 0;
    timer.current = setInterval(() => {
      time ++;
      if(time > TIMEOUT_LIMIT_GAME)
      {
        clearTimeout(timer.current);
        //alert('Time out');
      }  
    }, 1000);
  };

  //start game

  const StartGame = async () => {
    if(level.current == 'admin')
    {
      // set the start game flag
      axios.post(`${process.env.API_URL}/game/start/${code.substring(0, 4)}/${username}`).then(res => {
        if(res.data.success) {
          
          // show the winning pools
          setPriceHidden('block');
          setIsGameStarted(true);
          Counter();
        }
      });
    }
  };

  // Vote

  const Vote = (index) => {
    
    if(isGameStarted) { // if the game starts
      players.current = gameinfo;
      // get your information
      let you = players.current.filter(player => {
        if(player)
          return player.code == code;
        return false;
      })[0];

      let isYouVoted = !(you.voted[0] == '' || you.voted[1] == '' || you.voted[2] == ''); // are you voted out?

      let isAdminVoted = players.current[0].voted[0] != '' && players.current[0].voted[1] != '' && players.current[0].voted[2] != ''; // is admin voted out?

      if(!isYouVoted || level.current == 'admin' || (!isAdminVoted && you.order <= 2) || (isAdminVoted && you.order <= 2) ) { // if you have right to vote
        if(players.current[index].voted[0] != '' && players.current[index].voted[1] != '' && players.current[index].voted[2] != '') { // if the player has been kicked from the game
          setMessage("This player has been kicked from the game.");
          setSeverity('warning');
          setOpenNotify(true);                     
        } else {
          if(level.current == 'admin') // if the user is admin
          {
            //clearTimeout(timer);  
            if(previousVotedIndex.current == -1) { // in case of the admin's first vote
              previousVotedIndex.current = index;
              
              players.current[index].voted[0] = username; // admin votes the player

              // count the timeout until 10 mins
              let time = 0, time1 = 0;
              let timeHandler = setInterval(() => {
                console.log(players.current)
                if(players.current[index].voted[2] != '')
                {
                  clearInterval(timeHandler);
                } else {
                  if(players.current[index].voted[1] == '' && players.current[index].voted[2] == '') {
                    if(!isAdminVoted && you.order <= 2) { // at last scenario
                      time1 ++;
                      if(time1 >= TIMEOUT_LIMIT)
                      {
                        clearInterval(timeHandler);
                        alert('Game Over');
                      }
                    }
                    time ++;
                    
                    if(time >= TIMEOUT_LIMIT)
                    {
                      clearInterval(timeHandler);
                      players.current[index].voted[0] = '';
                      axios.post(`${process.env.API_URL}/game/vote/${ JSON.stringify({ code: code.substring(0, 4), players: players.current.filter(player => {
                          return player != null; 
                        })}) }`).then(res => {
                        if(res.data.success) {
                          setGameInfo(players.current);
                        }
                      }); 
                    } 
                  }
                }
                
                
              }, 1000);
            } else { 
              if(players.current[previousVotedIndex.current].voted[1] == '' && players.current[previousVotedIndex.current].voted[2] == '' ) { // if the player is not voted by other players
                players.current[previousVotedIndex.current].voted[0] = '';
                players.current[index].voted[0] = username; // admin votes the player
                previousVotedIndex.current = index;
                // count the timeout until 10 mins
              let time = 0, time1 = 0;
              let timeHandler = setInterval(() => {
                console.log(players.current)
                if(players.current[index].voted[2] != '')
                {
                  clearInterval(timeHandler);
                  
                } else {
                  if(players.current[index].voted[1] == '' && players.current[index].voted[2] == '') {
                    if(!isAdminVoted && you.order <= 2) { // at last scenario
                      time1 ++;
                      if(time >= TIMEOUT_LIMIT)
                      {
                        clearInterval(timeHandler);
                        alert('Game Over');
                      }
                    }
                    time ++;
                    //console.log(time)
                    if(time >= TIMEOUT_LIMIT)
                    {
                      clearInterval(timeHandler);
                      players.current[index].voted[0] = '';
                      axios.post(`${process.env.API_URL}/game/vote/${ JSON.stringify({ code: code.substring(0, 4), players: players.current.filter(player => {
                          return player != null; 
                        })}) }`).then(res => {
                        if(res.data.success) {
                          setGameInfo(players.current);
                        }
                      }); 
                    } 
                  }
                }
              }, 1000);

              } else { // if the player has already been voted by other players
                if(players.current[previousVotedIndex.current].voted[1] != '' && players.current[previousVotedIndex.current].voted[2] != '') { // if the player has been voted by two other players so admin can vote other player  
                  players.current[index].voted[0] = username; // admin votes the player
                  previousVotedIndex.current = index;
                } else {
                  setMessage("You can't vote this player.");
                  setSeverity('warning');
                  setOpenNotify(true);  
                }
              }
            }
          } else { // if the user is player
            if(players.current[index].voted[0] != '') { // if the player is voted by admin
              if(players.current[index].voted[1] == username || players.current[index].voted[2] == username) { // if the player is voted by you
                setMessage("You have already voted this player.");
                setSeverity('warning');
                setOpenNotify(true);
              } else {
                if(players.current[index].voted[1] != '') { // if the first vote is done.
                  
                  players.current[index].voted[2] = username; 
                  // make decision of order of player
                  let totalPlayerCount = players.current.filter(player => {
                    if(player)
                      return true;
                  }).length;
                  let votedCount = players.current.filter(player => {
                    if(player) 
                      return player.voted[0] != '' && player.voted[1] != '' && player.voted[2] != '';
                  }).length;
                  players.current[index].order = totalPlayerCount - votedCount;
                } else { 
                  players.current[index].voted[1] = username; 
                  // count the timeout until 10 mins
                  let time = 0;
                  let timeHandler = setInterval(() => {
                    console.log(players.current)
                    if(players.current[index].voted[2] != '') {
                      clearInterval(timeHandler);
                    } else {
                      if(players.current[index].voted[0] != '' && players.current[index].voted[1] != '' && players.current[index].voted[2] == '') {
                        time ++;
                        if(time >= TIMEOUT_LIMIT)
                        {
                          clearInterval(timeHandler);
                          players.current[index].voted[0] = players.current[index].voted[1] = players.current[index].voted[2] = '';
                          axios.post(`${process.env.API_URL}/game/vote/${ JSON.stringify({ code: code.substring(0, 4), players: players.current.filter(player => {
                              return player != null 
                            })}) }`).then(res => {
                            if(res.data.success) {
                              setGameInfo(players.current);
                            }
                          }); 
                        } 
                      }
                    }
                  }, 1000);
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
        axios.post(`${ process.env.API_URL }/game/vote/${ JSON.stringify({ code: code.substring(0, 4), players: players.current.filter(player => {
            return player != null 
          })}) }`).then(res => {
          if(res.data.success) {
            setGameInfo(players.current);
          }
        });        
        
      } else { // if you have no right to vote
        setMessage("You have no right to vote.");
        setSeverity('warning');
        setOpenNotify(true);        
      }  
    } else { // if the game has not started yet.
      setMessage("The game has not started yet.");
      setSeverity('warning');
      setOpenNotify(true);
    }
  }

  // positions of seat

  const positions = [
    {y: '82.5%', x: '27.5%'},
    {y: '60%', x: '5%'},
    {y: '30%', x: '5%'},
    {y: '7.5%', x: '27.5%'},
    {y: '7.5%', x: '62.5%'},
    {y: '30%', x: '85%'},
    {y: '60%', x: '85%'},
    {y: '82.5%', x: '62.5%'},
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

  // Alert handle

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleDialogClose = () => {
      setOpenDialog(false);
  };

  return (
    <>
      <Navbar title="Vote" username={`${username}(${code})`}  />
      <Container>
        <Box sx={{ bgcolor: 'green', position: 'absolute', top: '15%', left: '15%', height: '75%', width: '70%', borderRadius: 30 }} >
          {
            positions.map((pos, index) => {
              let seat;
              let temp_code = code.substring(0, 4) + '(0' + index + ')';
              let temp_username = 'Empty';
              let color = 'gray';
              let hidden = true;

              if(gameinfo[index] != null)
              {
                temp_code = gameinfo[index].code;
                temp_code = `${temp_code.slice(0, 4)}(${temp_code.slice(4, 6)})`
                temp_username = gameinfo[index].username;
                if(gameinfo[index].isPay && !(gameinfo[index].voted[0] != '' && gameinfo[index].voted[1] != '' && gameinfo[index].voted[2] != ''))
                {
                  color = 'limegreen';
                  hidden = false;
                } 
                
                seat = (
                  <Card key={index} onClick={() => {
                    Vote(index)
                  }} sx={{ width: '10%', height: '10%', backgroundColor:  color, position: 'absolute', top: pos.y, left: pos.x }}>             
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
                    <Typography variant="h6" sx={{position: 'absolute',top: '0%', width: '100%', height: '35%', textAlign: 'center'}} >
                      { temp_username }
                    </Typography>
                    <Typography variant='h6' sx={{position: 'absolute',top: '50%', width: '100%', height: '35%', textAlign: 'center'}}>
                    { temp_code }
                    </Typography>
                  </Card>
                  )
              } else {
                seat = (
                  <Card onClick={() => {
                    setMessage("This seat is empty");
                    setOpenNotify(true);
                    setSeverity('warning');
                  }} key={index} sx={{ width: '10%', height: '10%', backgroundColor:  color, position: 'absolute', top: pos.y, left: pos.x }}>             
                    <Typography variant="h6" sx={{position: 'absolute', left: '25%',top: '15%', width: '50%', height: '20%', textAlign: 'center'}} >
                      { temp_username }
                    </Typography>
                  </Card>
                )
              }

              return seat;
            })

          }
          <Card sx={{ width: '60%', height: '50%', borderRadius: 15, position: 'absolute', top: '25%', left: '20%', borderColor: 'red', borderWidth: '5px' }} >
            <Typography sx={{ display: priceHidden, position: 'absolute', left: '25%',top: '15%', width: '50%', height: '20%', textAlign: 'center'}} variant='h3'>
              1st:{(totalPrice * 0.5).toFixed(2)}
            </Typography>
            <Typography sx={{ display: priceHidden, position: 'absolute', left: '25%',top: '40%', width: '50%', height: '20%', textAlign: 'center'}} variant='h3'>
              2nd:{(totalPrice * 0.3).toFixed(2)}
            </Typography>
            <Typography sx={{ display: priceHidden, position: 'absolute', left: '25%',top: '65%', width: '50%', height: '20%', textAlign: 'center'}} variant='h3'>
              3rd:{(totalPrice * 0.2).toFixed(2)}
            </Typography>
          </Card>
          <Button onClick={StartGame} variant='contained' disabled={startButtonDisabled} size="large" color='success'  sx={{ display: startButtonHidden, width: '15%', height: '10%',position: 'absolute', bottom: '10%', left: '42.5%',top: '82.5%', alignItems: 'center', justify: 'center' }}>
              Start Game
          </Button>        
        </Box>
      </Container>
      <Notification open={openNotify} message={message} severity={severity} handleClose={notifyHandleClose} />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Winning Order</DialogTitle>
        <DialogContent sx={{alignItems: 'center', textAlign: 'left'}}>
            {
              winningOrder.map((order, index) => (
                <Typography key={index}>
                  {order.order + 1} : {order.username}{winning_rate[index] ? '(' + totalPrice * winning_rate[index] + '$)': ''}
                </Typography>
              ))
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
    </Dialog>      
    </>
  )
}

