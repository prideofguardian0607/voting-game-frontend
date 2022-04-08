import Link from "next/link";
import { useState } from "react";
import Button from '@mui/material/Button';
import { useEffect } from 'react'
import io from 'socket.io-client'
let socket

export default function Vote() {

    // const [gameInfo, setGameInfo] = useState(new Map([
    //     ["admin", 0],
    //     ["me", 0]
    // ]));

    // const colors = ['default', 'success'];

    // useEffect(() => socketInitializer(), [])

    // const socketInitializer = async () => {
    //     await fetch('/api/socket')
    //     socket = io()

    //     socket.on('connect', () => {
    //         console.log('connected')
    //     })
    // };

    // const onChangeHandler = (e) => {
    //     gameInfo.set(localStorage.getItem('username'), 1);
    //     setInput(gameInfo);
    //     socket.emit('input-change', gameInfo);
    // }

    

    return (
        <>
            {/* {
                gameInfo.forEach((value, key) => {
                    <Button color={colors[value]} >
                        {key}
                    </Button>
                })
            }
            <Button onClick={onChangeHandler}>
                Start
            </Button>
             */}
        </>
    )
}