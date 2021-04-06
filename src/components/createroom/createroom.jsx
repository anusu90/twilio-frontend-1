import React, { useEffect, useState, useRef, useContext } from 'react'
import { Redirect, useHistory, Link } from 'react-router-dom'

import { v4 as uuidv4 } from 'uuid';
import store from 'storejs';

// import * as Video from 'twilio-video';
import { connect } from 'twilio-video';


//import context

import { AppContext } from "../context/context"

export default function CreateRoom() {

    let [token, setToken] = useState("");

    let url = process.env.REACT_APP_BACKENDURL

    let { userListContext: [userList, setUserList], userContext: [user, setUser] } = useContext(AppContext)
    let myVideoStreamRef = useRef();
    let remoteStreamRef = useRef();
    let history = useHistory();

    const createRoom = async (data) => {

        //first create an access token

        let accessTokenReq = await fetch(`${url}/authtoken`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        let tokenBody = await accessTokenReq.json();
        let TOKEN = tokenBody.message;

        //if successfully created the access token. connect to a new room.

        if (accessTokenReq.status == 200) {
            store("twiliovideo", TOKEN);
            connect(TOKEN, {
                name: data.roomID,
                video: { width: 320 },
                audio: true,
            }).then(room => {

                console.log(`Successfully joined a Room: ${room}`); //Log successful creation of room

                // Add an event listener for successful remote participant joining the room.

                room.on('participantConnected', participant => {
                    console.log(`A remote Participant connected: ${participant}`);

                    setUserList([...room.participants])

                    participant.tracks.forEach(publication => {
                        console.log("pub is", publication)
                        if (publication.isSubscribed) {
                            const track = publication.track;
                            let video = track.attach()
                            video.autoPlay = true;
                            remoteStreamRef.current.appendChild(video)
                            console.log(remoteStreamRef.current)
                        }
                    })

                    participant.on('trackSubscribed', track => {
                        console.log("yo", track)
                        track.attach(remoteStreamRef.current)
                        let video = track.attach()
                        video.autoPlay = true;
                        remoteStreamRef.current.appendChild(video)
                        console.log(remoteStreamRef.current)
                    })
                });

                //handle participlant disconnection
                room.on('participantDisconnected', participant => {
                    console.log(`Participant disconnected: ${participant.identity}`);
                });


            }, error => {
                console.error(`Unable to connect to Room: ${error.message}`);
            });
        } else {
            console.log("error occured")
        }
    }

    useEffect(() => {
        console.log("ref is", myVideoStreamRef.current)
        if (store("?86984afbf4dd88c2")) {
            console.log("You are already in a room leave room first before continuing");
            history.push("/joinroom")
        } else {
            let roomID = uuidv4();
            let data = {
                name: user,
                roomID: roomID
            }
            console.log(roomID)
            store("86984afbf4dd88c2", roomID)
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                myVideoStreamRef.current.srcObject = stream;
            })
            createRoom(data);
        }

    }, [])

    return (

        <>
            <div>
                <Link to="/" onClick={() => store.remove("86984afbf4dd88c2")}>Home</Link>
                <Link to="joinroom">Join Room</Link>
            </div>
            <div>
                <video ref={myVideoStreamRef} playsInline autoPlay muted></video>
            </div>
            <div>
                <video ref={remoteStreamRef} playsInline autoPlay></video>
            </div>
        </>

    )

}
