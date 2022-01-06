import React from 'react';
import {useState,useEffect} from 'react';
import {Box,Typography,makeStyles,Avatar,Button,Grid, TextField}
from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {auth} from '../../utils/firebase';
import {createUserWithEmailAndPassword,getIdTokenResult } from "firebase/auth";
import {useHistory,Link} from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {createOrUpdateuser} from '../../functions/auth';


const useStyle = makeStyles((theme) =>({
  root:{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent:"center",
    maxWidth: "400vw",
    backgroundSize:'cover',
    minHeight: "100vh",
    overflow:"hidden",
  },

  body:{
    display:"flex",
    alignItems: "center",
    flexDirection: "column",
    width: "32vw",
    minHeight: "60vh",
    background:"rgba(255,255,255,0.15)",  
    backdropFilter:"blur(7px)",
    boxShadow:"10px 10px 10px rgba(30,30,30,0.1)",
    borderRadius: 20,
    borderLeft:"solid 1px rgba(255,255,255,0.3)",
    borderTop:"solid 1px rgba(255,255,255,0.8)",
    position:"fixed",
  },

  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "92%", 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  i:{
    position: "absolute",
    top: "38%",
    right: "16%"
  }
}));

function Signup(){
  let classes = useStyle();
  let mainbody = useStyle();
  const [firstName,setfirstName] = useState("")
  const [lastName,setlastName] = useState("")
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [passwordConfirm,setPasswordConfirm] = useState("")
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  
  const {user} = useSelector((state) => ({ ...state }));
  
  let dispatch = useDispatch();

  useEffect(() => {
    if (user && user.token) history.push('/');
  }, [user,history]);

  // save user email in local storage
  JSON.stringify(window.localStorage.setItem("emailForRegistration",email));
  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    if(password.length < 6){
      toast.error("Password must be 6 characters long");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
     
      if (result.user) {
        //remove user from localstorage
        window.localStorage.removeItem("emailForRegistration");
        //get user idtoken
        let user = auth.currentUser;
        const idTokenResult = await getIdTokenResult(user);
        
        createOrUpdateuser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role:res.data.role,
                  _id:res.data._id
                },
              });

            })
            .catch(error => console.log(error))
            history.push("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log(error)
    }
  };

  return(
    <Box className={classes.root}>
      
      <Box className={mainbody.body}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        
        
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                type="text"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Last Name"
                value={lastName}
                type="text"
                onChange={(e) => setlastName(e.target.value)}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="email"
                label="Email Address"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              /> 
              </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password Confirmation"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          {!user && (
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
           >
            Sign Up
          </Button>
          
          )}
          <div>
            Already have an account? <Link to="/login">Log In</Link>
          </div>
          
        </form>
      </Box>
    </Box>

  )
}
export default Signup;
