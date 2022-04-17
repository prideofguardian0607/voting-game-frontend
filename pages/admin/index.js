import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Notification from '../components/notification';
import Navbar from '../components/navbar';
import Router from 'next/router'

const theme = createTheme();

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
    border: 0,
    },
}));

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



export default function Admin() {

    const [open, setOpen] = React.useState(false);

    const [metausername, setMetaUserName] = React.useState('');
    const [gameusername, setGameUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [referredby, setReferredby] = React.useState('');
    const [rows, setRows] = React.useState([]);

    const [username, setUsername] = React.useState('');

    const [id, setId] = React.useState(0);

    const SetAdminInfo = (_id, metausername, gameusername, password, email, referredby) => {
        setId(_id);
        setMetaUserName(metausername);
        setGameUserName(gameusername);
        setPassword(password);
        setEmail(email);
        setReferredby(referredby);
    };

    //const { data: session, status } = useSession();
    

    //Once render when fetch from database
    React.useEffect(async () => {
        const Valid = async () => {
            axios.get(`${process.env.API_URL}user`
            ).then(res => {
                setRows(res.data.sort((a, b) => (a.calories < b.calories ? -1 : 1)))
                //console.log(res.data)
            }); 
        }
        Valid();

    }, [])

    // alert handle
    const handleClose = () => {
        setOpen(false);
    };

    const [buttonName, SetButtonName] = React.useState('update');

    const IsValid = () => {
        if (metausername === '') {
            setMessage('Meta Username is required.');
            setOpenNotify(true);
            setSeverity('warning');
            return false;
        } else if (gameusername === '') {
            setMessage('Game Username is required.');
            setOpenNotify(true);
            setSeverity('warning');
            return false;
        }else if(password.length < 6) {
            if(password.length == 0){
                setMessage('Password is required.');
                setOpenNotify(true);
                setSeverity('warning');
            } else {
                setMessage('Password must be at least 6 digits.');
                setOpenNotify(true);
                setSeverity('warning');
            }
            
            return false;
        } else if( email === ''){
            setMessage('Email is required.');
            setOpenNotify(true);
            setSeverity('warning');
            return false;
        } else if( !email.includes('@') ) {
            setMessage('Invalid Email');
            setOpenNotify(true);
            setSeverity('warning');
            return false;
        } else if( referredby === ''){
            setMessage('Referredby is required.');
            setOpenNotify(true);
            setSeverity('warning');
            return false;
        }
        return true;
    }

    // handle the user 

    const UpdateAdminInfo = () => {
        if(IsValid()){
            axios.put(`${process.env.API_URL}user/${id}/${ metausername }/${ gameusername }/${ password }/${ email }/${ referredby }`
            ).then(res => {
                if(res.data.success)
                {
                    let index = rows.findIndex((row) => {
                        return row._id == id;
                    })
                    console.log(index)
                    rows.splice(index, 1, {
                        metausername: metausername, 
                        username: gameusername, 
                        password: password, 
                        email: email,
                        referredby: referredby
                    })
                    setRows(rows);
                    setMessage('Admin was updated.');
                    setSeverity('success');
                    setOpenNotify(true);
                } else {
                    setMessage('Admin was not updated.');
                    setSeverity('warning');
                    setOpenNotify(true);
                }
            });
            handleClose();
        }
     };

    const CreateAdminInfo = () => {
    if(IsValid()){
        axios.post(`${process.env.API_URL}user/${ metausername }/${ gameusername }/${ password }/${ email }/${ referredby }`
        ).then(res => {
            
            if(res.data.success)
            {
                rows.splice(0, 0, res.data.user);
                setRows(rows);
                setMessage('New Admin was created.');
                setSeverity('success');
                setOpenNotify(true);
            } else {
                setMessage('Admin Info alrady exists.');
                setSeverity('warning');
                setOpenNotify(true);
            }
        });
        handleClose();
    }
    }

    const DeleteAdminInfo = () => {
        
        axios.delete(`${process.env.API_URL}user/${id}`).
        then((res) => {
            let index = rows.findIndex((row) => {
                return row._id == id;
            });
            rows.splice(index, 1);
            setRows(rows);
            setMessage('Admin was deleted.');
            setSeverity('success');
            setOpenNotify(true);
        });
        setOpen(false);
    };

    // table handle
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    // validate if the user login
  
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
        const res = await axios.get('${process.env.API_URL}user/valid', {
          headers: {
            "x-access-token": token
          }
        });
        
        setUsername(res.data.user.username);
        return res.data.isLoggedIn;
      } catch (err) {
        console.error(err);
      }
    } else {
      delete axios.defaults.headers.common['x-access-token'];
      return false;
    }
  }



    return (
        <ThemeProvider theme={theme}>
            <Navbar title="Admin Management" username={username}  />
            <Container component="main" maxWidth="lg" >
                <CssBaseline />
                <Grid container >
                    <Grid item xs={9} />
                    <Grid item xs={2} p={3}>
                        <Button                
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                            onClick={() => {
                                SetButtonName('Create');
                                setOpen(true);
                                SetAdminInfo('', '', '', '', '','');
                            }}
                        >
                            Add Admin
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>No</StyledTableCell>
                            <StyledTableCell align="center">Meta Username</StyledTableCell>
                            <StyledTableCell align="center">Username</StyledTableCell>
                            <StyledTableCell align="center">Password</StyledTableCell>
                            <StyledTableCell align="center">Email</StyledTableCell>
                            <StyledTableCell align="center">ReferredBy</StyledTableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row, index) => (
                            <TableRow key={index} onClick={() => {
                                SetAdminInfo(row._id, row.metausername, row.username, row.password, row.email, row.referredby);
                                SetButtonName('update');
                                setOpen(true);
                            }}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.metausername}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="center">
                                    {row.username}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="center">
                                    {row.password}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="center">
                                    {row.email}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="center">
                                    {row.referredby}
                                </TableCell>
                            </TableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        </TableBody>
                        <TableFooter>
                        <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                        </TableFooter>
                    </Table>
                    </TableContainer>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Admin Information</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        id="metausername"
                        label="Meta User Name"
                        variant="standard"
                        onChange={(e) => {
                            setMetaUserName(e.target.value)
                        }}
                        value={metausername}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Game User Name"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setGameUserName(e.target.value)
                        }}
                        value={gameusername}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        value={password}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        value={email}
                    />
                    <TextField
                        margin="dense"
                        id="referredby"
                        label="Referredby"
                        type="referredby"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setReferredby(e.target.value)
                        }}
                        value={referredby}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={DeleteAdminInfo}  color='error'>Delete</Button>
                    <Button onClick={() => {
                        if(buttonName === 'update')
                            UpdateAdminInfo();
                        else
                            CreateAdminInfo();
                    }} color='primary' variant='outlined'>{buttonName}</Button>
                </DialogActions>
            </Dialog>      
            <Notification open={openNotify} message={message} severity={severity} handleClose={notifyHandleClose} />  
        </ThemeProvider>
        
    );
}