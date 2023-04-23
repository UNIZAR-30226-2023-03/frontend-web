import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/loading.css";

async function buscartorneosactivos(settorneosActivos) {
  const response = await axios.get("https://lamesa-backend.azurewebsites.net/torneo");
  const torneos = response.data;
  const torneosactivos = [];
  torneos.forEach(torneo => {
    if (torneo.estado ==="ESPERANDO_JUGADORES") {
      torneosactivos.push(torneo);
    }
  });
  settorneosActivos(torneosactivos);
}
function esperarpartida(navigate,idTorneo){
  navigate(process.env.PUBLIC_URL+'/esperartorneo',{ state: { idTorneo}});
}
async function apuntarseTorneo(idTorneo,idUsuario,navigate){
  const response = await axios.post("https://lamesa-backend.azurewebsites.net/torneo/apuntar", {usuario: idUsuario,torneo: idTorneo});
  if(response.data.apuntado){
    esperarpartida(navigate,idTorneo);
  }
  else if(response.data.esjugador16){
    //empezar partida
  }
  else{
    //error
    // el usuario no se ha podido apuntar al torneo
  }
  
}

function Torneos(){
  const cookies= new Cookies();
  const navigate = useNavigate();
  const [torneosActivos, settorneosActivos] = useState([]);
  useEffect(() => {
    buscartorneosactivos(settorneosActivos); 
  }, []);
    return(
      <>
        <h1>TORNEOS</h1>
        <h2>Torneos disponibles</h2>
        {torneosActivos.map((torneo, index) => (
          <div key={index}>
            <table border={1}>
            <tr>
              <td colspan="3">torneo.nombre</td>
              <td rowspan="2"><button onClick={() => apuntarseTorneo(torneo.id,cookies.get('idUsuario'),navigate)}>Apuntarse</button></td>
            </tr>
            <tr>
              <td>torneo.precioEntrada</td>
              <td>torneo.configBarreras</td>
              <td>torneo.configFichas</td>
            </tr>
            </table>
          </div>
        ))}        
      </>
    );
}
/*
mostrar los torneos activos
boton para apuntarse a cada uno
le das al boton y esperas
y cuando eso, aparece un boton para empezar la partida
los 15 primeros por el scoket y el ultimo por el booleano
socket/topic/torneo/id


*/
export default Torneos;