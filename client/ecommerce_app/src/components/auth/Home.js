import React from 'react'
import { useSelector } from "react-redux";
function Home() {
    const { user } = useSelector((state) => ({ ...state }));
    return (
        <div>
            <p>Home</p>
            <hr />
            {JSON.stringify(user)}
        </div>
    )
}

export default Home;

