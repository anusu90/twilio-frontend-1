import React, { useContext } from 'react'
import { Link, Route } from 'react-router-dom'


//importing components

import JoinRoom from "../joinroom/joinroom"
import CreateRoom from "../createroom/createroom"


//import Context

import { AppContext } from "../context/context"


export default function Dashboard() {

    let { userListContext: [userList, setUserList], userContext: [user, setUser] } = useContext(AppContext)
    console.log(user)

    return (
        <>
            <div>
                <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
            </div>
            <div>
                <Link to="/createroom"> <button>Create Room</button> </Link>
                <Link to="/joinroom"> <button>Join Room</button> </Link>
            </div>
            <div>


            </div>
        </>
    )

}