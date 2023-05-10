import React, { useState, useEffect} from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import "../styles/Rankings.css";
import { useNavigate } from 'react-router-dom';
import home from "../imagenes/iconos/home.svg"

function Rankings(){
  const navigate = useNavigate();
  const cookies= new Cookies();
  const idUsuario = cookies.get('idUsuario');
  const [jugadoresrank, setjugadoresrank] = useState([]);
  const [erroractualizacion, seterroractualizacion] = useState("");
  const [mostrarBocadilloPG, setMostrarBocadilloPG] = useState(false);
  const [mostrarBocadilloPJ, setMostrarBocadilloPJ] = useState(false);
  const [mostrarBocadilloTG, setMostrarBocadilloTG] = useState(false);
  const [mostrarBocadilloTJ, setMostrarBocadilloTJ] = useState(false);
  const [mostrarBocadilloFC, setMostrarBocadilloFC] = useState(false);
  const [mostrarBocadilloFM, setMostrarBocadilloFM] = useState(false);
  const [amigosactuales, setamigosactuales] = useState([]);
  const [mostrarTitulo, setmostrarTitulo] = useState(true);
  const [filtradoamigos, setfiltradoamigos] = useState(false);

  useEffect(() => {
    async function buscaramigosactuales() {
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/amigos/"+idUsuario);
      const amigos = response.data;
      console.log("amigos actuales",amigos)
      const amigosact = [];
      amigos.forEach(amigo => {
        amigosact.push(amigo.username); 
      });
      setamigosactuales(amigosact);
    }
    buscaramigosactuales(); 
  }, [idUsuario]);

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

  const handleClick7 = () => {
    navigate(process.env.PUBLIC_URL+'/tienda');
  };

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
        <button className="botontienda" onClick={handleClick7}>Tienda</button>
        <h1 className="tituloPag">RANKING</h1>
        <br></br><br></br><br></br>
        <p>{erroractualizacion}</p>
        {mostrarTitulo && <button className="amigosranking" onClick={() => setfiltradoamigos(!filtradoamigos)}>
          {filtradoamigos ? 'QUITAR FILTRO' : 'FILTRAR POR AMIGOS'}
        </button>}
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
                onMouseEnter={() => {setMostrarBocadilloTG(true)}}
                onMouseLeave={() => {setMostrarBocadilloTG(false)}}></button></th>
                <th>Torneos jugados<button 
                className="botonOrdenar" onClick={() => ordenarRanking("torneosJugados")}
                onMouseEnter={() => setMostrarBocadilloTJ(true)}
                onMouseLeave={() => setMostrarBocadilloTJ(false)}></button></th>
                <th>Fichas comidas<button
                 className="botonOrdenar" onClick={() => ordenarRanking("numComidas")}
                 onMouseEnter={() => {setMostrarBocadilloFC(true);setmostrarTitulo(false)}}
                 onMouseLeave={() => {setMostrarBocadilloFC(false);setmostrarTitulo(true)}}></button></th>
                <th>Fichas en meta<button 
                className="botonOrdenar" onClick={() => ordenarRanking("numEnMeta")}
                onMouseEnter={() => {setMostrarBocadilloFM(true);setmostrarTitulo(false)}}
                onMouseLeave={() => {setMostrarBocadilloFM(false);setmostrarTitulo(true)}}></button></th>   
              </tr>
            </thead>
            <tbody>
              {jugadoresrank.map((jugador, index) => {
                if (filtradoamigos && amigosactuales.includes(jugador.username)) {
                  return (
                    <tr key={index}>
                      <td>
                        {index+1 === 1 ? <button className="primero"></button> :
                          index+1 === 2 ? <button className="segundo"></button> :
                          index+1 === 3 ? <button className="tercero"></button> :
                          index+1}
                      </td>
                      <td>{jugador.username}</td>
                      <td>{jugador.pganadas}</td>
                      <td>{jugador.pjugadas}</td>
                      <td>{jugador.tganados}</td>
                      <td>{jugador.tjugados}</td>
                      <td>{jugador.mediaComidas}</td>
                      <td>{jugador.mediaEnMeta}</td>                            
                    </tr>
                  );
                }
                else if (!filtradoamigos) {
                  return (
                    <tr key={index}>
                      <td>
                        {index+1 === 1 ? <button className="primero"></button> :
                          index+1 === 2 ? <button className="segundo"></button> :
                          index+1 === 3 ? <button className="tercero"></button> :
                          index+1}
                      </td>
                      <td>{jugador.username}</td>
                      <td>{jugador.pganadas}</td>
                      <td>{jugador.pjugadas}</td>
                      <td>{jugador.tganados}</td>
                      <td>{jugador.tjugados}</td>
                      <td>{jugador.mediaComidas}</td>
                      <td>{jugador.mediaEnMeta}</td>                            
                    </tr>
                  );
                }
                return null;
              })} 
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