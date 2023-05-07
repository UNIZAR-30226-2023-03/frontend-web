import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "../styles/loading.css";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import "../styles/EsperarTorneo.css";
import { Button, Modal } from 'react-bootstrap';

function EsperarTorneo(){
    const cookies= new Cookies();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [idTorneo, setIdTorneo] = useState("");
    const [nombreTorneo, setnombreTorneo] = useState("");
    const [poderempezar, setpoderempezar] = useState(false);
    const [showModalSeguroSalir, setShowModalSeguroSalir] = useState(false);
    const [ultimojugador, setultimojugador] = useState(false);
    

    useEffect(() => {
        if (state) {
            setIdTorneo(state.idTorneo);
            setnombreTorneo(state.nombreTorneo);
            setultimojugador(state.soy16);
            if(!state.soy16){         
                function connectToSocket() {
                    const url = "https://lamesa-backend.azurewebsites.net"
                    let socket = new SockJS(url + "/ws");
                    let stompClient = Stomp.over(socket);
                    console.log("esperando en torneo: "+state.idTorneo);
                    stompClient.connect({}, function (frame) {
                        stompClient.subscribe("/topic/torneo/" + state.idTorneo, function (response) {
                            setpoderempezar(true);
                        })
                    })
                }
                connectToSocket();
            }
        }
        // eslint-disable-next-line
    }, []);

    async function jugarTorneo(idUsuario,navigate){
        const response = await axios.post("https://lamesa-backend.azurewebsites.net/torneo/jugar", {usuario: idUsuario,torneo: idTorneo});
        //empezar partida
        let id_part = response.data.id;
        let col = response.data.color;
        let jug = response.data.jugadores;
        let num_fichas = response.data.cf;
        console.log("CONFIGURACION FICHAS: "+num_fichas);
        let tipo = "torneo";
        navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo,num_fichas,nombreTorneo,idTorneo } });
    }

    async function desapuntarTorneo(idUsuario,navigate){
        await axios.post("https://lamesa-backend.azurewebsites.net/torneo/desapuntar", {usuario: idUsuario,torneo: idTorneo});
        let accion = "desapuntado";
        navigate(process.env.PUBLIC_URL+'/torneos', { state: { accion } });
    }

    
    return(
        <>
            <h1>BIENVENIDO AL TORNEO {nombreTorneo}</h1>
            {!poderempezar && !ultimojugador &&
            <>
                <div className="loading-container">
                    <div className="loading-circle"></div>
                </div>
                <p className="esperaJugadores">Esperando jugadores...</p>
            </>}
            {(poderempezar || ultimojugador) && <button className="empezarTorneoBoton" onClick={() => jugarTorneo(cookies.get('idUsuario'),navigate)}>¡Empezar a jugar!</button>}
            {showModalSeguroSalir && <div className="fondo-negro"></div>}
            <Button className="salirTorneoBoton" onClick={() => setShowModalSeguroSalir(true)}>Salir del torneo</Button>
            <Modal 
                show={showModalSeguroSalir && !ultimojugador} 
                onHide={() => setShowModalSeguroSalir(false)} 
                centered
                className="custom-modal-segurosalir"
            >
            <Modal.Header>
            <Button className="cerrarModal" onClick={() => {
                setShowModalSeguroSalir(false);
            }}>X</Button>
            <Modal.Title className="modalTitle">¿Seguro que quieres abandonar el torneo?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="button-container">
                    <button className="siboton" onClick={() => desapuntarTorneo(cookies.get('idUsuario'),navigate)}>Sí</button>
                    <button className="noboton" onClick={() => setShowModalSeguroSalir(false)} style={{ marginRight: "5%" }}>No</button>
                </div>
            </Modal.Body>
            </Modal>
        </>
    );
}

export default EsperarTorneo;
