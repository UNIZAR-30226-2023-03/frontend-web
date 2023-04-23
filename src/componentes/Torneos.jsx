import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
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
async function apuntarseTorneo(idTorneo,idUsuario){
  await axios.get("https://lamesa-backend.azurewebsites.net/torneo", {usuario: idUsuario,torneo: idTorneo});
  //setusuarioapuntado(true);
}

function Torneos(){
  const cookies= new Cookies();
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
              <td rowspan="2"><button onClick={() => apuntarseTorneo(torneo.id,cookies.get('idUsuario'))}>Apuntarse</button></td>
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