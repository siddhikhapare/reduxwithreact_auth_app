import React,{useState} from 'react'
import { makeStyles} from '@material-ui/core/styles';
import {AppBar,Toolbar,Typography,Button} from '@material-ui/core';
import {Link,useHistory} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import { signOut } from "firebase/auth";
import { auth} from "../../utils/firebase";
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    buttonStyles: {
      margin: "0 6px 0",
      display: "inline-block",
    },
    
}));

function Appbar() {
    const classes = useStyles();
    const history = useHistory();
    const [error, setError] = useState("");
    
    let dispatch = useDispatch();
    let {user} =  useSelector((state) => ({...state}));
    
    const handleLogin = () =>{
      if(history)
      history.push("/login");
    }
    const handleSignup = () =>{
      if(history)
      history.push("/signup");
    }

    async function handleLogout() {
      setError("")
  
      try {
        signOut(auth)
        dispatch({
          type:"LOGOUT",
          payload:null,
        }) 
      } catch(error) {
        setError("Failed to log out")
      }
    };
    
    return (
      <div className={classes.root}>
       <CssBaseline /> 
      <AppBar position="static">
        <Toolbar>
          
          <Typography variant="h6" className={classes.title}>
               Vendor App
          </Typography>
          {user ? (
            <Button
                variant="outlined"
                className={classes.logout}
                onClick={handleLogout}
              >
                Log Out
              </Button>
              
             ): (
              <div >
                <Link to='/login'>
                   <Button  className={classes.buttonStyles}
                     variant="contained"
                      onClick={handleLogin}>
                        Login
                      </Button>
                  </Link>
                
                  <Link to="/signup">
                    <Button className={classes.buttonStyles}
                    variant="contained"
                    onClick={handleSignup}>
                      Signup
                    </Button>
                  </Link>
                  
             </div>
            )}
             {user && user.role === "subscriber" && (
            
              <Link to="/user/history"> 
              <Button className={classes.buttonStyles}
              variant="contained">
                User Dashboard
              </Button></Link>
           
          )}

           {user && user.role==="admin" && (
          
            <Link to="/admin/dashboard">
            <Button className={classes.buttonStyles}
            variant="contained">
              Admin Dashboard
            </Button></Link>
            
            )}
        </Toolbar>
        {error && <Alert severity="error">{error}</Alert>}
      </AppBar>
      
    </div>
    )
}

export default Appbar;
