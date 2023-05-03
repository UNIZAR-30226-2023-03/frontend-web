import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../styles/Principal.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Principal(){
    // const [nombre, setNombre] = useState('');
    // const [password, setPassword] = useState('');
    // const [configuracion, setConfig] = useState('');
    const [estadisticasjugador, setestadisticasjugador] = useState('');
    const navigate = useNavigate();
    const [mostrarPartidas, setMostrarPartidas] = useState(false);
    //const [confPartada, setconfParitada] = useState('');
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

    const handleClick = () => {
        setMostrarPartidas(true);
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

    return (
        <>
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
          <button className="botontienda" onClick={handleClick7}>Tienda</button>
          <div className="estadisticas">
            <p className="tituloEstadisticas">Estadísticas personales</p>
            {/* <p> Fichas comidas: {estadisticasjugador.mediaComidas}</p>
            <p> Fichas en meta: {estadisticasjugador.mediaEnMeta}</p>
            <p> Partidas jugadas: {estadisticasjugador.pjugadas}</p>
            <p> Partidas ganadas: {estadisticasjugador.pganadas}</p>
            <p> Torneos ganados: {estadisticasjugador.tganados}</p>
            <p> Torneos ganados: {estadisticasjugador.tganados}</p> */}
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
        </>
      );
      
    
}

export default Principal;