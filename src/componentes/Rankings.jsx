import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../styles/Rankings.css";
import home from "../imagenes/iconos/home.svg"

function Rankings(){
  const [jugadoresrank, setjugadoresrank] = useState([]);
  const [erroractualizacion, seterroractualizacion] = useState("");
  const [mostrarBocadilloPG, setMostrarBocadilloPG] = useState(false);
  const [mostrarBocadilloPJ, setMostrarBocadilloPJ] = useState(false);
  const [mostrarBocadilloTG, setMostrarBocadilloTG] = useState(false);
  const [mostrarBocadilloTJ, setMostrarBocadilloTJ] = useState(false);
  const [mostrarBocadilloFC, setMostrarBocadilloFC] = useState(false);
  const [mostrarBocadilloFM, setMostrarBocadilloFM] = useState(false);
  const [mostrarTitulo, setmostrarTitulo] = useState(true);
  let posicion = 1;
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
        {mostrarTitulo ? (
          <h1 className="tituloPag">RANKING</h1>
        ) : (
          <h1 className="tituloPag" style={{ color: "rgba(119, 55, 3, 0)" }}>----</h1>
        )}
        <p>{erroractualizacion}</p>
        <div className="ranking-table">      
          <table >
            <thead>
              <tr>
                <th>Posición</th>
                <th>Usuario</th>
                <th>Partidas ganadas <button 
                className="botonOrdenar" onClick={() => ordenarRanking("partidasGanadas")}
                onMouseEnter={() => setMostrarBocadilloPG(true)}
                onMouseLeave={() => setMostrarBocadilloPG(false)}></button></th>
                <th>Partidas jugadas<button 
                className="botonOrdenar" onClick={() => ordenarRanking("partidasJugadas")}
                onMouseEnter={() => setMostrarBocadilloPJ(true)}
                onMouseLeave={() => setMostrarBocadilloPJ(false)}></button></th>
                <th>Torneos ganados<button 
                className="botonOrdenar" onClick={() => ordenarRanking("torneosGanados")}
                onMouseEnter={() => {setMostrarBocadilloTG(true);setmostrarTitulo(false)}}
                onMouseLeave={() => {setMostrarBocadilloTG(false);setmostrarTitulo(true)}}></button></th>
                <th>Torneos jugados<button 
                className="botonOrdenar" onClick={() => ordenarRanking("torneosJugados")}
                onMouseEnter={() => setMostrarBocadilloTJ(true)}
                onMouseLeave={() => setMostrarBocadilloTJ(false)}></button></th>
                <th>Fichas comidas<button
                 className="botonOrdenar" onClick={() => ordenarRanking("numComidas")}
                 onMouseEnter={() => setMostrarBocadilloFC(true)}
                 onMouseLeave={() => setMostrarBocadilloFC(false)}></button></th>
                <th>Fichas en meta<button 
                className="botonOrdenar" onClick={() => ordenarRanking("numEnMeta")}
                onMouseEnter={() => setMostrarBocadilloFM(true)}
                onMouseLeave={() => setMostrarBocadilloFM(false)}></button></th>   
              </tr>
            </thead>
            <tbody>
              {jugadoresrank.map((jugador) => (
                <tr>      
                  <td>{posicion++ === 1 ? <img src='../imagenes/iconos/primero.png' alt=""/> :
                    posicion++ === 2 ? <img src='../imagenes/iconos/segundo.png' alt=""/> :
                    posicion++ === 3 ? <img src='../imagenes/iconos/tercero.png' alt=""/> :
                    posicion++}</td>
                  <td>{jugador.username}</td>
                  <td>{jugador.pganadas}</td>
                  <td>{jugador.pjugadas}</td>
                  <td>{jugador.tganados}</td>
                  <td>{jugador.tjugados}</td>
                  <td>{jugador.mediaComidas}</td>
                  <td>{jugador.mediaEnMeta}</td>                            
                </tr>
              ))} 
            </tbody>
          </table>    
        </div>
        {mostrarBocadilloPG && (
          <p className="ordenarPG">
            Ordenar por <br></br> partidas ganadas
          </p>
      )}  
        {mostrarBocadilloPJ && (
          <p className="ordenarPJ">
            Ordenar por <br></br> partidas jugadas
          </p>
      )}  
        {mostrarBocadilloTG && (
          <p className="ordenarTG">
            Ordenar por <br></br> torneos ganados
          </p>
      )}  
        {mostrarBocadilloTJ && (
          <p className="ordenarTJ">
            Ordenar por <br></br> torneos jugados
          </p>
      )}  
        {mostrarBocadilloFC && (
          <p className="ordenarFC">
            Ordenar por <br></br> fichas comidas
          </p>
      )}  
        {mostrarBocadilloFM && (
          <p className="ordenarFM">
            Ordenar por <br></br> fichas en meta
          </p>
      )}      
      </>
    );
}

export default Rankings;