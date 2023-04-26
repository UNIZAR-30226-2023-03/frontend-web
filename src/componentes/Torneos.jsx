import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/loading.css";
import "../styles/Torneos.css";
import home from "../imagenes/iconos/home.svg"


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
            <div class="breadcrumb">
              <div class="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div class="breadcrumb-item">&gt;</div>
              <div class="breadcrumb-item">Torneos</div>
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
              <td colspan="3" className="nombre-torneo">{torneo.nombre}</td>
              <td rowspan="2"><button onClick={() => apuntarseTorneo(torneo.id,cookies.get('idUsuario'),navigate)}>Apuntarse</button></td>
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
              <td colspan="3" className="nombre-torneo">NOMBRE TORNEO</td>
              <td rowspan="2"><button>Apuntarse</button></td>
            </tr>
            <tr>
              <td>torneo.precioEntrada</td>
              <td>torneo.configBarreras</td>
              <td>torneo.configFichas</td>
            </tr>
            </table>
          </div>
        {jugadordesapuntado && <p>Has sido desapuntado del torneo satisfactoreamente</p>}
        <button onClick={() => setshowcreartorneo(!showcreartorneo)}>Crear torneo</button>
      </>
    );
}

export default Torneos;