import React, { useState, useRef, useEffect, useContext } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { AppContext } from "../context/context"
import store from 'storejs';
import * as Video from 'twilio-video';
import { connect } from 'twilio-video';


export default function JoinRoom() {

    let url = process.env.REACT_APP_BACKENDURL

    let { userListContext: [userList, setUserList], userContext: [user, setUser] } = useContext(AppContext)
    let TOKEN;
    let myRef = useRef(null)
    let myVideoStreamRef = useRef(null)

    let [roomID, setRoomID] = useState("");
    let history = useHistory();

    function leaveRoom() {
        store.remove("86984afbf4dd88c2");
        history.push("/");
    }

    const joinRoom = async () => {

        let data = {
            name: user,
            roomID: roomID
        }

        let accessTokenReq = await fetch(`${url}/authtoken`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (accessTokenReq.status == 200) {
            TOKEN = await accessTokenReq.json();
            TOKEN = TOKEN.message;

            connect(TOKEN, {
                name: data.roomID,
                video: { width: 320 },
                audio: true,
            }).then(room => {

                console.log(`Successfully joined a Room: ${room}`); //Log successful creation of room

                // Add an event listener for successful remote participant joining the room.

                room.on('participantConnected', participant => {
                    console.log(`A remote Participant connected: ${participant}`);

                    participant.tracks.forEach(publication => {
                        console.log(publication)
                        if (publication.isSubscribed) {
                            const track = publication.track;
                            console.log(track.attach())
                        }
                    })

                    participant.on('trackSubscribed', track => {
                        console.log("yo", track)
                        console.log("now tracks are", track.attach())
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
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            myVideoStreamRef.current.srcObject = stream;
        })
    }, [])

    return (
        <>
            <div>
                <input type="text" name="" id="" value={roomID} onChange={(e) => setRoomID(e.target.value)} ref={myRef} />
                <button onClick={joinRoom}> Join Room</button>
                <br />
                <button onClick={leaveRoom}> Leave Room</button>
            </div>
            <div>
                <video ref={myVideoStreamRef} playsInline autoPlay muted></video>
            </div>

        </>
    )
}