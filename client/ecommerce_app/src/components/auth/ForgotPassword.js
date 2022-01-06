import React, { useEffect,useState} from "react"
import { Typography,Grid,makeStyles, Button, Box, TextField } from "@material-ui/core";
import {Link} from "react-router-dom";
import {auth} from '../../utils/firebase';
import { sendPasswordResetEmail} from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const useStyle = makeStyles((theme) =>({
  root:{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent:"center",
    maxWidth: "400vw",
    backgroundSize:'cover',
    minHeight: "100vh",
  },

  body:{
    display:"flex",
    alignItems: "center",
    flexDirection: "column",
    width: "32vw",
    minHeight: "30vh",
    background:"rgba(255,255,255,0.15)", 
    backdropFilter:"blur(7px)",
    boxShadow:"10px 10px 10px rgba(30,30,30,0.1)",
    borderRadius: 20,
    borderLeft:"solid 1px rgba(255,255,255,0.3)",
    borderTop:"solid 1px rgba(255,255,255,0.8)",
    position:"static",
  },
  form: {
    width: "92%", 
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
}));

export default function ForgotPassword({history}) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const classes = useStyle();
  const mainbody = useStyle();
  
  const {user} = useSelector((state) => ({...state}));

  useEffect(() => {
    if (user && user.token){
      history.push("/")
    }
  },[history,user]);

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const config = {
       url:'http://localhost:3000/login',      
       handleCodeInApp: true,
    };

    await sendPasswordResetEmail(auth,email,config)
    .then(() => {
        setEmail('')
        setLoading(false)
        toast.success("Click the link sent to you email to reset password")

    })
    .catch((error) => {
        setLoading(false)
        toast.error(error.message)
        console.log(error)
    });
  }

  return (
    <Box className={classes.root}>
      <Box className={mainbody.body}>
        <Typography>Password Reset</Typography>
        
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Button 
              disabled={loading} 
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              type="submit">
                Reset Password
              </Button> 
          
          </Grid>
          <br/>
          <div>
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </Box>
    
  </Box>  
    
  )
}