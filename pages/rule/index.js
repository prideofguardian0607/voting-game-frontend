import Link from "next/link"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import StarIcon from '@mui/icons-material/Star';
import ListItemButton from '@mui/material/ListItemButton';


export default function Rule() {

    const rules = [
        'Keeper needs to stay in the game till the end to get paid on last vote',
        'Last three players need to stay in the game and vote till the end to get paid',
        'Keepers vote is worth 50% of the vote',
        'Players vote is worth 25% of the vote',
        'To be voted off the game you need one keeper’s vote (50%) and two player’s vote’s (25%) to be confirmed ',
        'If stale mate has been reached with last three players all plays loose funds',
        'Keeper is to ensure all players have their micks on during play',
        'Please note that teaming could happen and it’s up to the Keeper to choose their friends carefully',
        'If Keeper loses, Deposit money will be reimbursed to keeper’s wallet',
        'Game will time out after 30 Min if no votes have been reached, all remaining players will be reimbursed ',
        'This Decentralized platform has been designed for private entertainment purposes only, to hold in trust the players participation fee and distribute the moneys back to the players through a voting mechanism',
    ]
    return (
        <>
            <List >
                {
                    rules.map((rule, index) => (
                        <ListItem key={index}>
                            <ListItemButton>
                                <StarIcon />
                                <ListItemText primary={rule} />
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
            <Link href='/signup'>
                <a>BACK</a>
            </Link>
        </>
    )
}