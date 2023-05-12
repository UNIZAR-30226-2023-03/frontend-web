import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../styles/Principal.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Button, Modal } from 'react-bootstrap';
import tablero from "../imagenes/tablero/tablero.png";
import tablero01 from "../imagenes/tablero/tablero Negro.png";
import tablero1 from "../imagenes/tablero/tablero_Halloween.png";
import tablero2 from "../imagenes/tablero/tablero_Navidad.png";
import ficha1 from "../imagenes/tablero/ficha_Halloween.png";
import ficha2 from "../imagenes/tablero/ficha_Navidad.png";
import tablero11 from "../imagenes/tablero/tablero_Halloween_NEGRO.png";
import tablero21 from "../imagenes/tablero/tablero_Navidad_NEGRO.png";
import ficha11 from "../imagenes/tablero/Ficha_Halloween_Negro.png";
import ficha21 from "../imagenes/tablero/Ficha_navidad_Negro.png";
import cruz from "../imagenes/iconos/cruz.png";


function Principal(){
    const [estadisticasjugador, setestadisticasjugador] = useState('');
    const navigate = useNavigate();
    const [mostrarPartidas, setMostrarPartidas] = useState(false);
    const [ShowModalSeguroBaja, setShowModalSeguroBaja] = useState(false);
    const [monedas, setmonedas] = useState(0);
    const cookies= new Cookies();
    const idUsuario = cookies.get('idUsuario');
    const [mostrar, setMostrar]=useState(false);
    const tabl = Array(3).fill(false);
    const fichas = Array(3).fill(false);

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
    useEffect(()=>{
      async function consultarActivo(yo){
        //sacar que producto tiene activo
        tabl[0]=true;
        fichas[0]=true;
      }
      consultarActivo(idUsuario)
    }, [idUsuario,tabl,fichas])
  
  
  
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
    const handleClick8 = () => {
      if(mostrar){
        setMostrar(false);
      }
      else {  setMostrar(true);}
      
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
    async function id0(){

    }

    return (
        <>       
          <div class="monedasJugador" data-number={monedas}></div>
          <h1>BIENVENIDO {cookies.get('nombreUsuario')}</h1>
          <br></br><br></br><br></br><br></br><br></br>
          {mostrar?
            <div className="inv">
              {tabl[0] ? <img className="btn1" src={tablero01} alt="" /> : <img className="btn" src={tablero} alt="" onClick={id0}/>}
              {tabl[1] ? <img className="btn1" src={tablero11} alt="" /> : <img className="btn" src={tablero1} alt="" onClick={id0}/>}
              {tabl[2] ? <img className="btn1" src={tablero21} alt="" /> : <img className="btn" src={tablero2} alt="" onClick={id0}/>}
              {fichas[0] ? <img className="btn1" src={ficha11} alt="" /> : <img className="btn" src={ficha1} alt="" onClick={id0}/>}
              {fichas[1] ? <img className="btn1" src={ficha21} alt="" /> : <img className="btn" src={ficha2} alt="" onClick={id0}/>}
              {fichas[2] ? <img className="btn1" src={ficha11} alt="" /> : <img className="btn" src={ficha1} alt="" onClick={id0}/>}
              <div className="cruzcont"><img className="cruz" src={cruz} alt="" onClick={handleClick8}/></div>
               
            </div>
            : <div></div> }
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
          <button className="botonInventario" onClick={handleClick8}>Inventario</button>
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