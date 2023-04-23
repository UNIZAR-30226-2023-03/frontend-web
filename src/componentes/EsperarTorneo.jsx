import React, { useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
import "../styles/loading.css";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function EsperarTorneo(){
    const { state } = useLocation();
    const [idTorneo, setIdTorneo] = useState([]);
    useEffect(() => {
        if (state) {
            setIdTorneo(state.idTorneo);
        }
    }, [state]);

    useEffect(() => {
        function connectToSocket() {
            const url = "https://lamesa-backend.azurewebsites.net"
            let socket = new SockJS(url + "/ws");
            let stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                stompClient.subscribe("/topic/torneo/" + idTorneo, function (response) {
                    // Un jugador se ha unido a la partida (cuando aún no ha empezado)
                    let data = JSON.parse(response.body);
                    //if(data.color !== color){}
                })
            })
        }
        connectToSocket();
        // eslint-disable-next-line
      }, []);
    
    return(
        <>
            <div className="loading-container">
                <div className="loading-circle"></div>
                <p>Esperando jugadores...</p>
            </div>
            <div>
                <button>¡Empezar a jugar!</button>
                <button>Salir del torneo</button>
            </div>
        </>
    );
}

export default EsperarTorneo;
