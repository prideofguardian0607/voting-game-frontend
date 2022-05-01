import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
export default function Loader(props) {

    return (
        <Stack sx={{ color: 'grey.500', display: props.hidden }} spacing={2} alignItems="center" direction="column">
            <CircularProgress color="secondary" />
        </Stack>
    )
}