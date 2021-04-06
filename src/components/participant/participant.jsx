import React, { useState, useRef, useEffect } from 'react'


export default function Participant(props) {

    let [tracks, setTracks] = useState([]);
    let videoRef = useRef(null);

    useEffect(() => {
        props.participant.on("trackSubscribed", track => {
            setTracks(prevTracks => [...prevTracks, track])
        })
        return () => {
            setTracks([])
        }
    }, [props.participant])

    useEffect(() => {
        // tracks.forEach(track => {
        //     if (track) {
        //         track.attack(videoRef.current);
        //     }
        // })
        tracks.forEach(track => {
            if (track) {
                try {
                    console.log(track.attach())
                    track.attach(videoRef.current)
                } catch (error) {
                    console.log(error)
                }

            }
        })
    }, [tracks])

    return (
        <div>
            <video playsInline autoPlay ref={videoRef}>HELLO</video>
        </div>
    )

}