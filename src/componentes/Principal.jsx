import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../styles/Principal.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Button, Modal } from 'react-bootstrap';

function Principal(){
    const [estadisticasjugador, setestadisticasjugador] = useState('');
    const navigate = useNavigate();
    const [mostrarPartidas, setMostrarPartidas] = useState(false);
    const [ShowModalSeguroBaja, setShowModalSeguroBaja] = useState(false);
    const [monedas, setmonedas] = useState(0);
    const cookies= new Cookies();
    const idUsuario = cookies.get('idUsuario');
    useEffect(() => {
      async function buscarestadisticas() {
        await axios.get("https://lamesa-backend.azurewebsites.net/usuario/estadisticas/"+idUsuario)
        .then ( response => {
          console.log("estadisticas: "+response.data)
          setestadisticasjugador(response.data);
        })
      }
      buscarestadisticas(); 
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      async function buscarmonedas() {
        await axios.get("https://lamesa-backend.azurewebsites.net/usuario/monedas/"+idUsuario)
        .then ( response => {
          setmonedas(response.data);
        })
      }
      buscarmonedas(); 
      // eslint-disable-next-line
    }, []);

    async function probarReconexion(){
      await axios.post("https://lamesa-backend.azurewebsites.net/partida/reconectar/"+idUsuario) 
      .then ( response => {
        console.log("RECONEXION: ",response.data);
        if(response.data === ""){
          setMostrarPartidas(true);
        }
        else{
          let id_part = response.data.id;
          let col = response.data.color;
          let jug = response.data.jugadores;
          let tipo = "PRIVADA";
          let num_fichas = response.data.cf;
          console.log("configuracion de las fichas: "+num_fichas);
          navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo,num_fichas } });
        }
      }) 
    }
    const handleClick = () => {
      probarReconexion();
    };

    const handleClick1 = () => {
        navigate(process.env.PUBLIC_URL+'/partidaPublica');
    };
    
    const handleClick2 = () => {
      navigate(process.env.PUBLIC_URL+'/partidaPrivada');
    };
    const handleClick3 = () => {
      navigate(process.env.PUBLIC_URL+'/datosPersonales');
    };
    const handleClick4 = () => {
      navigate(process.env.PUBLIC_URL+'/amigos');
    };
    const handleClick5 = () => {
      navigate(process.env.PUBLIC_URL+'/torneos');
    };
    const handleClick6 = () => {
      navigate(process.env.PUBLIC_URL+'/rankings');
    };
    const handleClick7 = () => {
      navigate(process.env.PUBLIC_URL+'/tienda');
    };
    async function darbaja(){
      await axios.post("https://lamesa-backend.azurewebsites.net/usuario/eliminar/"+idUsuario) 
      .then ( response => {
        navigate(process.env.PUBLIC_URL+'/');
      }) 
      .catch(error => {
        setShowModalSeguroBaja(false);
      })  
    }

    return (
        <>       
          <div class="monedasJugador" data-number={monedas}></div>
          <h1>BIENVENIDO {cookies.get('nombreUsuario')}</h1>
          <br></br><br></br><br></br><br></br><br></br>
         
          <button className="botonDatosPersonales" onClick={handleClick3}>Datos personales</button>         
          {mostrarPartidas ? (
              <div className="botones">
                <button className="botonJugarPublica" onClick={handleClick1}>
                  Partida Pública
                </button>
                <button className="botonJugarPrivada" onClick={handleClick2}>
                  Partida Privada
                </button>
              </div>
            ) : (
              <div>
                <button className="botonJugar" onClick={handleClick}>
                  Jugar
                </button>
              </div>
            )}
          <button className="botonAmigos" onClick={handleClick4}>Amigos</button>
          <button className="botontorneos" onClick={handleClick5}>Torneos</button>
          <button className="botonrankings" onClick={handleClick6}>Rankings</button>
          <button className="botonbaja" onClick={() => setShowModalSeguroBaja(true)}>Darme de baja</button>
          <button className="botontienda" onClick={handleClick7}>Tienda</button>
          <div className="estadisticas">
            <p className="tituloEstadisticas">Estadísticas personales</p>
            <p className="subtituloEstadisticas">Fichas comidas:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.mediaComidas}</p>
            <br></br>
            <p className="subtituloEstadisticas">Fichas en meta:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.mediaEnMeta}</p>
            <br></br>
            <p className="subtituloEstadisticas">Partidas jugadas:&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.pjugadas}</p>
            <br></br>
            <p className="subtituloEstadisticas">Partidas ganadas:&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.pganadas}</p>
            <br></br>
            <p className="subtituloEstadisticas">Torneos jugados:&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.tjugados}</p>
            <br></br>
            <p className="subtituloEstadisticas">Torneos ganados:&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.tganados}</p>
          </div>
          {ShowModalSeguroBaja && <div className="fondo-negro"></div>}
          <Modal 
            show={ShowModalSeguroBaja} 
            onHide={() => setShowModalSeguroBaja(false)} 
            centered
            className="custom-modal-segurosalir"
        >
        <Modal.Header>
        <Button className="cerrarModal" onClick={() => {
            setShowModalSeguroBaja(false);
        }}>X</Button>
        <Modal.Title className="modalTitle">¿Seguro que quieres darte de baja?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="button-container">
                <button className="siboton" onClick={() => darbaja()}>Sí</button>
                <button className="noboton" onClick={() => setShowModalSeguroBaja(false)} style={{ marginRight: "5%" }}>No</button>
            </div>
        </Modal.Body>
        </Modal>
        </>
      );
      
    
}

export default Principal;