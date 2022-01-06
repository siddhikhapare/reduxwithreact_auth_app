import React from 'react';
import {useState,useEffect} from 'react';
import {Box,Typography,makeStyles,Avatar,Button,Grid,TextField}
from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useHistory,Link} from "react-router-dom"
import { auth} from "../../utils/firebase";
import { signInWithEmailAndPassword ,getIdTokenResult,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import { toast } from "react-toastify";
import { useDispatch,useSelector} from "react-redux";
import GoogleButton from "react-google-button";
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
    overflow:"hidden"
  },

  body:{
    display:"flex",
    alignItems: "center",
    flexDirection: "column",
    width: "30vw",
    minHeight: "60vh",
    background:"rgba(255,255,255,0.15)",  //as a object style components
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
    fontSize: 20,
  }

}));

function Login(){
  let classes = useStyle();
  let mainbody = useStyle();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  let dispatch = useDispatch();
  const provider = new GoogleAuthProvider();
  const {user} = useSelector((state) => ({ ...state }));
  
  useEffect(() => {
    let intended=history.location.state;
      if(intended){
          return;
      }else{
          if(user && user.token) {
              history.push("/");
          }
      }
  }, [user,history]);

  window.localStorage.getItem("emailForRegistration")
  

  const roleBasedRedirect = (res) =>{
  //check if intended
    let intended=history.location.state;
    if(intended){
        history.push(intended.from);
    }else{
        if(res.data.role === "admin"){
            history.push("/admin/dashboard");
        }else{
            history.push("/user/history");
        }
    }
  
  };
  
    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true)
    try {
        const result = await signInWithEmailAndPassword(auth,email, password)
        const { user } = result;
        const idTokenResult = await getIdTokenResult(user);

        createOrUpdateuser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name:res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role:res.data.role,
                  _id:res.data._id
                },
              });
              roleBasedRedirect(res);  
            })
            .catch(error => console.log(error))
          } catch (error) {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
      }
    };
      
    const googleLogin = async() => {
      setLoading(true);
      signInWithPopup(auth,provider)
      .then(async(result) => {
        const {user} = result
        const idTokenResult = await getIdTokenResult(user);
        
        createOrUpdateuser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name:res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role:res.data.role,
                  _id:res.data._id
                },
              });
              roleBasedRedirect(res); 
            })
            .catch(error => console.log(error))
          })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
      });
    };
  

return(
    <Box className={classes.root}>
      
      <Box className={mainbody.body}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="email"
                label="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="off"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={password}
                label="Password"
                type="password"
                onChange={e => setPassword(e.target.value)}
                id="password"
                autoComplete="current-password"
              />
            </Grid>
        </Grid>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Log In
          </Button>
          <Grid container>
          <Grid item xs>
              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </Grid>
           
            <Grid item>
              <Link to="/signup" >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Grid>
          <Box className={classes.google}>
              <p style={{textAlign:"center"}}>OR</p>
              <GoogleButton
                style={{ width: "100%", outline: "none" }}
                onClick={googleLogin}
              />
            </Box>
          </Grid>
          
        </form>
      </Box>
    </Box>

  )
}
export default Login;



