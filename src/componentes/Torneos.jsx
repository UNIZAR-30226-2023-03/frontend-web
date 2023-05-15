import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/loading.css";
import "../styles/Torneos.css";
import home from "../imagenes/iconos/home.svg";
import { Button, Modal } from 'react-bootstrap';


function esperarpartida(navigate,nombreTorneo, idTorneo,soy16){
  navigate(process.env.PUBLIC_URL+'/esperartorneo',{ state: { idTorneo, nombreTorneo,soy16}});
}

async function apuntarseTorneo(nombreTorneo,idTorneo,idUsuario,navigate, seterrorapuntarsetorneo){
  console.log("apuntandome al torneo: "+nombreTorneo);
  console.log("apuntandome al torneo: "+idTorneo);
  console.log("apuntandome al torneo: "+idUsuario);
  await axios.post("https://lamesa-backend.azurewebsites.net/torneo/apuntar", {usuario: idUsuario,torneo: idTorneo})
  .then ( response => {
    console.log("apuntado: "+response.data.apuntado);
    console.log("jugador16: "+response.data.esJugador16);
    if(response.data.esJugador16){
      console.log("SOY EL 16");
      //empezarpartidatorneo(idUsuario,idTorneo,navigate);
      esperarpartida(navigate,nombreTorneo,idTorneo,true);
    }
    else if(response.data.apuntado){
      esperarpartida(navigate,nombreTorneo,idTorneo,false);
    }
  })
  .catch(error => {
    console.log("ERROR");
    console.log(error.response.data);
    seterrorapuntarsetorneo(error.response.data);
  })   
}

function Torneos(){
  const { state } = useLocation();
  const cookies= new Cookies();
  const idUsuario = cookies.get('idUsuario');
  const navigate = useNavigate();
  const [torneosActivos, settorneosActivos] = useState([]);
  const [jugadordesapuntado, setjugadordesapuntado] = useState(false);
  const [showcreartorneo, setshowcreartorneo] = useState(false);
  const [nombrenuevotorneo, setnombrenuevotorneo] = useState("");
  const [monedas, setmonedas] = useState(0);
  const [configuracionB, setconfiguracionB] = useState("SOLO_SEGUROS");
  const [configuracionF, setconfiguracionF] = useState("NORMAL");
  const [torneocreado, settorneocreado] = useState(false);
  const [errorcreartorneo, seterrorcreartorneo] = useState("");
  const [errorapuntarsetorneo, seterrorapuntarsetorneo] = useState("");
  
  useEffect(() => {
    if (state) {
      if(state.accion === "desapuntado"){
        setjugadordesapuntado(true);
      }
    }
  }, [state]);

  useEffect(() => {
    async function buscartorneosactivos() {
      await axios.get("https://lamesa-backend.azurewebsites.net/torneo")
      .then ( response => {
        const torneos = response.data;
        console.log("torneos: ",torneos);
        const torneosactivos = [];
        torneos.forEach(torneo => {
          torneosactivos.push(torneo);
          console.log("torneo : "+torneo.nombre);
          console.log(torneo.cb);
          console.log(torneo.cf);
        });
        settorneosActivos(torneosactivos);
      })
    }
    buscartorneosactivos(); 
  }, []);
  async function crearTorneo(){
    settorneocreado(false);
    await axios.post("https://lamesa-backend.azurewebsites.net/torneo/crear", {usuario:idUsuario, nombre: nombrenuevotorneo, precio:monedas, configBarreras: configuracionB, configFichas: configuracionF})
    .then ( response => {
      console.log("torneo creado: "+response.data.id);
      settorneocreado(true);
      setshowcreartorneo(false);
      if(response.data.apuntado){
        esperarpartida(navigate,nombrenuevotorneo,response.data.id,false);
      }
      else if(response.data.esjugador16){
        //empezarpartidatorneo(idUsuario,response.data.id,navigate);
        esperarpartida(navigate,nombrenuevotorneo,response.data.id,true);
      }
    })
    .catch(error => {
      seterrorcreartorneo(error.response.data);
    })    
  }
 
    return(
      <>
        {torneocreado &&<p className="mensajeConfirmacion">Torneo creado correctamente</p>}
        <div>
          <div className="back4">
            <div className="breadcrumb">
              <div className="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div className="breadcrumb-item">&gt;</div>
              <div className="breadcrumb-item">Torneos</div>
            </div>
          </div>              
        </div>
        <br></br>
        <h1>TORNEOS</h1>
        <h2>Torneos disponibles</h2>
        {torneosActivos.map((torneo, index) => (
          <div key={index}className="torneosdisponibles">
            <table>
              <tr>
                <td colSpan="3" className="nombre-torneo">{torneo.nombre}</td>
                <td rowSpan="3"><button className="apuntarseboton" onClick={() => apuntarseTorneo(torneo.nombre,torneo.id,idUsuario,navigate,seterrorapuntarsetorneo)}>Participar en el torneo <br></br> {torneo.precioEntrada}</button></td>
              </tr>
              <tr>
              <td colSpan="2" className="infoParTor">Modo de las partidas:</td>
              </tr>
              <tr>
                {torneo.cf === "RAPIDO" &&
                 <td className="infoTor">PARTIDAS CON 2 FICHAS</td>}
                {torneo.cf === "NORMAL" &&
                <td className="infoTor">PARTIDAS CON 4 FICHAS</td>}
                {torneo.cb ==="SOLO_SEGUROS" &&
                <td className="infoTor">BARRERAS SOLO EN SEGUROS</td>}
                {torneo.cb ==="TODAS_CASILLAS" &&
                <td className="infoTor">BARRERAS EN TODAS CASILLAS</td>}                
              </tr>
            </table>
          </div>
        ))}
        <p className="mensajeError">{errorapuntarsetorneo}</p>
        {jugadordesapuntado && <p className="mensajeConfirmacion">Desapuntado del torneo con éxito</p>}
        {showcreartorneo && <div className="fondo-negro"></div>}
        <Button className="creartorneoboton" onClick={() => setshowcreartorneo(true)}>Crear torneo</Button>
        <Modal 
          show={showcreartorneo} 
          centered
          className="custom-modal-creartorneo"
        >
          <Modal.Header>
          <Button className="cerrarModal" onClick={() => {
            setshowcreartorneo(false);
          }}>X</Button>
          <Modal.Title className="modalTitle">Creación de un nuevo torneo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="numjug">
            <p className="Titulobody">Nombre del nuevo torneo</p>
            <input type="text" onChange={(e) => setnombrenuevotorneo(e.target.value)}
              value={nombrenuevotorneo} placeholder="Nombre del torneo..." />

            <p className="Titulobody">Cuota de entrada</p>
            <input type="number" onChange={(e) => setmonedas(e.target.value)}
              value={monedas}  min="0" />
              <button className="monedaCuota"></button>
            
            <p className="Titulobody">Personalización de las partidas</p>

            <div className="botonesRapida">
                <button className={configuracionF==="NORMAL" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={() =>  setconfiguracionF("NORMAL")}>Partida normal</button> 
                <button className={configuracionF==="RAPIDO" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={() =>  setconfiguracionF("RAPIDO")}>Partida rápida</button> 
            </div>

            <div className="botonesBarrera">
                <button className={configuracionB==="SOLO_SEGUROS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={() =>  setconfiguracionB("SOLO_SEGUROS")}>Partidas con barreras normales</button> 
                <button className={configuracionB==="TODAS_CASILLAS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={() =>  setconfiguracionB("TODAS_CASILLAS")}>Partidas con barreras en todas las casillas</button> 
            </div>
            <p></p>
            <button className="crearTorneo" onClick={() => crearTorneo()} >Crear torneo</button>
            <p className="mensajeError">{errorcreartorneo}</p>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default Torneos;