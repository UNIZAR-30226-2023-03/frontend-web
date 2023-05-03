import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../styles/Rankings.css";
import home from "../imagenes/iconos/home.svg"

function Rankings(){
  const [jugadoresrank, setjugadoresrank] = useState([]);
  const [erroractualizacion, seterroractualizacion] = useState("");
  let posicion = 0;
  function actualizarRanking(jug){
    const jugadores = [];
    jug.forEach(jugador => {     
      jugadores.push(jugador);
    });
    setjugadoresrank(jugadores);
  }
  async function ordenarRanking(campo){
    await axios.get("https://lamesa-backend.azurewebsites.net/usuario/ranking?campo="+campo)
    .then ( response => {
      actualizarRanking(response.data);
    })
    .catch(error => {
      seterroractualizacion(error.response.data); 
    })   
  }
  useEffect(() => {
    async function buscarjugadores() {
      await axios.get("https://lamesa-backend.azurewebsites.net/usuario/ranking?campo=partidasGanadas")
      .then ( response => {
        console.log("ACTUALIZAR RANKING: "+response.data);
        actualizarRanking(response.data);
      })
      .catch(error => {
        seterroractualizacion(error.response.data); 
      })
    }
    buscarjugadores(); 
  }, []);

    return(
      <>
        <div>
          <div className="back5">
            <div className="breadcrumb">
              <div className="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div className="breadcrumb-item">&gt;</div>
              <div className="breadcrumb-item">Rankings</div>
            </div>
          </div>             
        </div>
        <h1 className="tituloPag">RANKING</h1>
        <p>{erroractualizacion}</p>       
            {/* <table className="ranking-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Usuario</th>
                <th>Partidas ganadas <button className="botonOrdenar" onClick={() => ordenarRanking("partidasGanadas")}></button></th>
                <th>Partidas jugadas<button className="botonOrdenar" onClick={() => ordenarRanking("partidasJugadas")}></button></th>
                <th>Torneos ganados<button className="botonOrdenar" onClick={() => ordenarRanking("torneosJugados")}></button></th>
                <th>Torneos jugados<button className="botonOrdenar" onClick={() => ordenarRanking("torneosGanados")}></button></th>
                <th>Fichas comidas<button className="botonOrdenar" onClick={() => ordenarRanking("numComidas")}></button></th>
                <th>Fichas en meta<button className="botonOrdenar" onClick={() => ordenarRanking("numEnMeta")}></button></th>   
              </tr>
            </thead>
            <tbody>
            {jugadoresrank.map((jugador) => (
              <tr>      
                <td>{posicion++}</td>
                <td>{jugador.username}</td>
                <td>{jugador.pjganadas}</td>
                <td>{jugador.pjugadas}</td>
                <td>{jugador.tganados}</td>
                <td>{jugador.tjugados}</td>
                <td>{jugador.mediaComidas}</td>
                <td>{jugador.mediaEnMeta}</td>                            
              </tr>
            ))} 
            </tbody>
            </table> */}
            <table className="ranking-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Usuario</th>
                <th>Partidas ganadas <button className="botonOrdenar" onClick={() => ordenarRanking("partidasGanadas")}></button></th>
                <th>Partidas jugadas<button className="botonOrdenar" onClick={() => ordenarRanking("partidasJugadas")}></button></th>
                <th>Torneos ganados<button className="botonOrdenar" onClick={() => ordenarRanking("torneosJugados")}></button></th>
                <th>Torneos jugados<button className="botonOrdenar" onClick={() => ordenarRanking("torneosGanados")}></button></th>
                <th>Fichas comidas<button className="botonOrdenar" onClick={() => ordenarRanking("numComidas")}></button></th>
                <th>Fichas en meta<button className="botonOrdenar" onClick={() => ordenarRanking("numEnMeta")}></button></th>   
              </tr>
            </thead>
            <tbody>
              <tr>      
                <td>2</td>
                <td>1</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>                            
              </tr>
            </tbody>
            </table>
        
        
      </>
    );
}

export default Rankings;