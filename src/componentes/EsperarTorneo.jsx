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
    const [idTorneo, setIdTorneo] = useState([]);
    const [poderempezar, setpoderempezar] = useState(false);
    const [showModalSeguroSalir, setShowModalSeguroSalir] = useState(false);
   
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
            {!poderempezar &&
            <>
                <div className="loading-container">
                    <div className="loading-circle"></div>
                </div>
                <p className="esperaJugadores">Esperando jugadores...</p>
            </>}
            {poderempezar && <button className="empezarTorneoBoton" onClick={() => jugarTorneo(cookies.get('idUsuario'),navigate)}>¡Empezar a jugar!</button>}
            {showModalSeguroSalir && <div className="fondo-negro"></div>}
            <Button className="salirTorneoBoton" onClick={() => setShowModalSeguroSalir(true)}>Salir del torneo</Button>
            <Modal 
            show={showModalSeguroSalir} 
            onHide={() => setShowModalSeguroSalir(false)} 
            centered
            className="custom-modal-segurosalir"
            >
            <Modal.Header>
            <Button className="cerrarModal" onClick={() => {
                setShowModalSeguroSalir(false);
            }}>X</Button>
            <Modal.Title className="modalTitle">¿Seguro que quieres abandonar el torneo?</Modal.Title>
            <div className="button-container">
                <button className="siboton" onClick={() => desapuntarTorneo(cookies.get('idUsuario'),navigate)}>Sí</button>
                <button className="noboton" onClick={() => setShowModalSeguroSalir(false)} style={{ marginRight: "5%" }}>No</button>
            </div>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            </Modal>
        </>
    );
}

export default EsperarTorneo;
