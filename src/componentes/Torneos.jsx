import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/loading.css";
import "../styles/Torneos.css";
import home from "../imagenes/iconos/home.svg";
import { Button, Modal } from 'react-bootstrap';


function esperarpartida(navigate,idTorneo){
  navigate(process.env.PUBLIC_URL+'/esperartorneo',{ state: { idTorneo}});
}
async function apuntarseTorneo(idTorneo,idUsuario,navigate){
  const response = await axios.post("https://lamesa-backend.azurewebsites.net/torneo/apuntar", {usuario: idUsuario,torneo: idTorneo});
  if(response.data.apuntado){
    esperarpartida(navigate,idTorneo);
  }
  else if(response.data.esjugador16){
    const response = await axios.post("https://lamesa-backend.azurewebsites.net/torneo/jugar", {usuario: idUsuario,torneo: idTorneo});
    //empezar partida
    let id_part = response.data.id;
    let col = response.data.color;
    let jug = response.data.jugadores;
    let tipo = "torneo";
    navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo } });
  }
  else{
    //error
    // el usuario no se ha podido apuntar al torneo
  }
  
}

function Torneos(){
  const { state } = useLocation();
  const cookies= new Cookies();
  const navigate = useNavigate();
  const [torneosActivos, settorneosActivos] = useState([]);
  const [jugadordesapuntado, setjugadordesapuntado] = useState(false);
  const [showcreartorneo, setshowcreartorneo] = useState(false);
  const [nombrenuevotorneo, setnombrenuevotorneo] = useState("");
  const [numjugadores, setnumjugadores] = useState(0);
  const [configuracionB, setconfiguracionB] = useState("SOLO_SEGUROS");
  const [selectedValue, setSelectedValue] = useState('');
  
  const handleOptionChange = (event) => {
    setSelectedValue(event.target.value);
  }
  
  useEffect(() => {
    if (state) {
      if(state.accion === "desapuntado"){
        setjugadordesapuntado(true);
      }
    }
  }, [state]);

  useEffect(() => {
    async function buscartorneosactivos() {
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/torneo");
      const torneos = response.data;
      console.log("torneos: ",torneos);
      const torneosactivos = [];
      torneos.forEach(torneo => {
        if (torneo.estado ==="ESPERANDO_JUGADORES") {
          torneosactivos.push(torneo);
          console.log("torneo : "+torneo.nombre);
        }
      });
      settorneosActivos(torneosactivos);
    }
    buscartorneosactivos(); 
  }, []);
 
    return(
      <>
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
                <td rowSpan="2"><button onClick={() => apuntarseTorneo(torneo.id,cookies.get('idUsuario'),navigate)}>Apuntarse</button></td>
              </tr>
              <tr>
                <td>{torneo.precioEntrada}</td>
                <td>{torneo.configBarreras}</td>
                <td>{torneo.configFichas}</td>
              </tr>
            </table>
          </div>
        ))}
          <div className="torneosdisponibles">
            <table>
            <tr>
              <td colSpan="3" className="nombre-torneo">NOMBRE TORNEO</td>
              <td rowSpan="2"><button>Apuntarse</button></td>
            </tr>
            <tr>
              <td>torneo.precioEntrada</td>
              <td>torneo.configBarreras</td>
              <td>torneo.configFichas</td>
            </tr>
            </table>
          </div>
        {jugadordesapuntado && <p>Has sido desapuntado del torneo satisfactoreamente</p>}
        {showcreartorneo && <div className="fondo-negro"></div>}
        <Button onClick={() => setshowcreartorneo(true)}>Crear torneo</Button>
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
            <p>Nombre del nuevo torneo</p>
            <input type="text" onChange={(e) => setnombrenuevotorneo(e.target.value)}
              value={nombrenuevotorneo} placeholder="Nombre del torneo..." />
            <p>Número de jugadores</p>
           
            
              <label>
                <input type="radio" name="radioGroup" value="4" checked={selectedValue === "4"} onChange={handleOptionChange} />
                4
              </label>
              <label>
                <input type="radio" name="radioGroup" value="8" checked={selectedValue === "8"} onChange={handleOptionChange} />
                8
              </label>
              <label>
                <input type="radio" name="radioGroup" value="16" checked={selectedValue === "16"} onChange={handleOptionChange} />
                16
              </label>
           
          

            <p>Cuota de entrada</p>
            <input type="number" onChange={(e) => setnumjugadores(e.target.value)}
              value={numjugadores}  min="0" /> monedas
            
            <p>Personalización de las partidas</p>
            <div className="botonesBarrera">
                <button className={configuracionB==="SOLO_SEGUROS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={() =>  setconfiguracionB("SOLO_SEGUROS")}>Partidas con barreras normales</button> 
                <button className={configuracionB==="TODAS_CASILLAS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={() =>  setconfiguracionB("TODAS_CASILLAS")}>Partidas con barreras en todas las casillas</button> 
            </div>
            <button className="crearTorneo" >Crear torneo</button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default Torneos;