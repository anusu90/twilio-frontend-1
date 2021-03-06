import React, { useState } from 'react'

export const AppContext = React.createContext();

export const AppContextProvider = (props) => {

    let [user, setUser] = useState("Anunay");
    let [userList, setUserList] = useState([]);

    return (

        <AppContext.Provider value={{ userListContext: [userList, setUserList], userContext: [user, setUser] }}>
            {props.children}
        </AppContext.Provider>

    )



}
