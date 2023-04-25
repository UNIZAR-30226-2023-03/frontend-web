import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "../styles/loading.css";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function EsperarTorneo(){
    const cookies= new Cookies();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [idTorneo, setIdTorneo] = useState([]);
    const [poderempezar, setpoderempezar] = useState(false);
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
                    setpoderempezar(true);
                })
            })
        }
        connectToSocket();
        // eslint-disable-next-line
    }, []);

    async function jugarTorneo(idUsuario,navigate){
        const response = await axios.post("https://lamesa-backend.azurewebsites.net/torneo/jugar", {usuario: idUsuario,torneo: idTorneo});
        //empezar partida
        let id_part = response.data.id;
        let col = response.data.color;
        let jug = response.data.jugadores;
        let tipo = "torneo";
        navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo } });
    }

    async function desapuntarTorneo(idUsuario,navigate){
        await axios.post("https://lamesa-backend.azurewebsites.net/torneo/desapuntar", {usuario: idUsuario,torneo: idTorneo});
        let accion = "desapuntado";
        navigate(process.env.PUBLIC_URL+'/torneos', { state: { accion } });
    }

    
    return(
        <>
            <div className="loading-container">
                <div className="loading-circle"></div>
                <p>Esperando jugadores...</p>
            </div>
            <div>
                {poderempezar && <button onClick={() => jugarTorneo(cookies.get('idUsuario'),navigate)}>¡Empezar a jugar!</button>}
                <button onClick={() => desapuntarTorneo(cookies.get('idUsuario'),navigate)}>Salir del torneo</button>
            </div>
        </>
    );
}

export default EsperarTorneo;
