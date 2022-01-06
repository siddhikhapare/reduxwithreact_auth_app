import React,{useEffect,useState} from 'react';
import {Route} from 'react-router-dom';
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import {CurrentAdmin} from '../../functions/auth'

function AdminRoute({children, ...rest}) {
    const { user } = useSelector((state) => ({ ...state }));
    const [right,setRight] = useState(false);

    useEffect(() => {
        if (user && user.token) {
          CurrentAdmin(user.token)
            .then((res) => {
              console.log("CURRENT ADMIN RES", res);
              setRight(true);
            })
            .catch((err) => {
              console.log("ADMIN ROUTE ERR", err);
              setRight(false);
            });
        }
      }, [user]); 

  return right ? <Route {...rest}/> : <LoadingToRedirect />;
  
}

export default AdminRoute;

