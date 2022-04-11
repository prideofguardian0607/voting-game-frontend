// import Link from "next/link";
// import { useState } from "react";
// import Button from '@mui/material/Button';
// import { useEffect } from 'react'
// import io from 'socket.io-client'
// let socket

// export default function Vote() {

//     // const [gameInfo, setGameInfo] = useState(new Map([
//     //     ["admin", 0],
//     //     ["me", 0]
//     // ]));

//     // const colors = ['default', 'success'];

//     // useEffect(() => socketInitializer(), [])

//     // const socketInitializer = async () => {
//     //     await fetch('/api/socket')
//     //     socket = io()

//     //     socket.on('connect', () => {
//     //         console.log('connected')
//     //     })
//     // };

//     // const onChangeHandler = (e) => {
//     //     gameInfo.set(localStorage.getItem('username'), 1);
//     //     setInput(gameInfo);
//     //     socket.emit('input-change', gameInfo);
//     // }

    

//     return (
//         <>
//             {/* {
//                 gameInfo.forEach((value, key) => {
//                     <Button color={colors[value]} >
//                         {key}
//                     </Button>
//                 })
//             }
//             <Button onClick={onChangeHandler}>
//                 Start
//             </Button>
//              */}
//         </>
//     )
// }


import { useEffect, useState } from 'react'
import io from 'Socket.IO-client'
let socket;

const Vote = () => {
  const [input, setInput] = useState('')

  useEffect(() => socketInitializer(), [])

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', msg => {
      setInput(msg)
    })
  }

  const onChangeHandler = (e) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}

export default Vote;