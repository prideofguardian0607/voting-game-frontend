import React from 'react';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification(props) {

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={props.open} autoHideDuration={props.duration} onClose={props.handleClose}>
          <Alert onClose={props.handleClose} severity={props.severity} sx={{ width: '100%' }}>
            {props.message}
          </Alert>
        </Snackbar>
    </Stack>
  )
}