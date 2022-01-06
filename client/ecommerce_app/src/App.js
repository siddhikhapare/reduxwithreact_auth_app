import React,{useEffect} from 'react';
import Signup from "./components/auth/Signup";
import { BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import {auth} from './utils/firebase';
import { onAuthStateChanged,getIdTokenResult} from "firebase/auth";
import {useDispatch } from "react-redux";
import Home from "./components/auth/Home";
import Appbar from './components/auth/Appbar';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Currentuser} from './functions/auth';
import History from './pages/user/History';
import UserRoute from './components/routes/UserRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/routes/AdminRoute';

function App(){
  const dispatch = useDispatch();
  //to check firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async (user) => {
      if (user) {
        const idTokenResult = await getIdTokenResult(user);
        
        Currentuser(idTokenResult.token)
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

        })
        .catch(error => console.log(error))
      }  
    });
    //cleanup
    return () => unsubscribe();
  }, [dispatch]);
  
  const noscroll = () => {
    window.scrollTo(0,0);
  }

  useEffect(() => {
      window.addEventListener("scroll",noscroll);
      return () => window.removeEventListener("scroll",noscroll)
  },[]);


  return (
    
      <div>
        
        <Router>
          <Appbar/>
          <ToastContainer position="top-center"/>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <UserRoute exact path="/user/history" component={History} />
              <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
            </Switch>
        </Router>
       
      </div>
    )
}

export default App;
