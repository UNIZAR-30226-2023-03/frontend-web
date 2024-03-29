import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "../styles/loading.css";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import "../styles/EsperarTorneo.css";

function EsperarFinal(){
    const cookies= new Cookies();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [idTorneo, setIdTorneo] = useState("");
    const [nombreTorneo, setnombreTorneo] = useState("");
    const [poderempezar, setpoderempezar] = useState(false);
    const [ultimojugador, setultimojugador] = useState(false);

    useEffect(() => {
        if (state) {
            setIdTorneo(state.idtorneo);
            setnombreTorneo(state.nombretorneo); 
            setultimojugador(state.soy16);
            if(!state.soy16){         
                function connectToSocket() {
                    const url = "https://lamesa-backend.azurewebsites.net"
                    let socket = new SockJS(url + "/ws");
                    let stompClient = Stomp.over(socket);
                    console.log("esperando en final torneo: "+state.idtorneo);
                    stompClient.connect({}, function (frame) {
                        stompClient.subscribe("/topic/final/" + state.idtorneo, function (response) {
                            setpoderempezar(true);
                        })
                    })
                }
                connectToSocket();
            }
        }
        // eslint-disable-next-line
    }, []);

    async function jugarFinal(idUsuario,navigate){
        const response = await axios.post("https://lamesa-backend.azurewebsites.net/torneo/jugar-final", {usuario: idUsuario,torneo: idTorneo});
        //empezar partida
        let id_part = response.data.id;
        let col = response.data.color;
        let jug = response.data.jugadores;
        let num_fichas = response.data.cf;
        console.log("CONFIGURACION FICHAS: "+num_fichas);
        let tipo = "torneoFinal";
        navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo,num_fichas,nombreTorneo,idTorneo } });
    }


    
    return(
        <>
            <h1>BIENVENIDO A LA FINAL DEL TORNEO {nombreTorneo}</h1>
            {!poderempezar && !ultimojugador &&
            <>
                <div className="loading-container">
                    <div className="loading-circle"></div>
                </div>
                <p className="esperaJugadores">Esperando finalistas...</p>
            </>}
            {(poderempezar || ultimojugador) && <button className="empezarTorneoBoton" onClick={() => jugarFinal(cookies.get('idUsuario'),navigate)}>¡Empezar a jugar!</button>}
        </>
    );
}

export default EsperarFinal;
