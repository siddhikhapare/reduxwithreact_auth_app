import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

function LoadingToRedirect() {
    const [count,setCount] = useState(5);
    let history = useHistory();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        },1000)

        count === 0 && history.push("/")
        //cleanup
        return () => clearInterval(interval)

    },[history,count]);

    return (
        <div>
            <p>Redirecting you in {count} seconds</p>
        </div>
    )
}

export default LoadingToRedirect;
