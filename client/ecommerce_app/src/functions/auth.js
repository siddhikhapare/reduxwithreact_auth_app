import axios from 'axios';
require('dotenv').config();

export const createOrUpdateuser = async(idToken) => {
    return await axios.post(
      `${process.env.REACT_APP_API}/create-or-update-user`,{},{
        
       headers:{
        'Authorization':idToken,
       },
    })
  }


 export const Currentuser = async(idToken) => {
    return await axios.post(
      `${process.env.REACT_APP_API}/current-user`,{},{
        
       headers:{
        'Authorization':idToken,
      },
    })
  }

  export const CurrentAdmin = async(idToken) => {
    return await axios.post(
      `${process.env.REACT_APP_API}/current-admin`,{},{
        
       headers:{
        'Authorization':idToken,
      },
    })
  }

  