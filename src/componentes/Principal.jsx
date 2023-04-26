import React, { useState } from 'react';
import "../styles/Principal.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Principal(){
    // const [nombre, setNombre] = useState('');
    // const [password, setPassword] = useState('');
    // const [configuracion, setConfig] = useState('');
    // const [jugador, setJugador] = useState('');
    const navigate = useNavigate();
    const [mostrarPartidas, setMostrarPartidas] = useState(false);
    //const [confPartada, setconfParitada] = useState('');

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
    const cookies= new Cookies();
    return (
        <>
          <h1>BIENVENIDO {cookies.get('nombreUsuario')}</h1>
          
          <button onClick={handleClick3}>Datos personales</button>
          <button onClick={handleClick4}>Amigos</button>
          <button onClick={handleClick5}>Torneos</button>
          <button onClick={handleClick6}>Rankings</button>
          <button onClick={handleClick7}>Tienda</button>
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
        </>
      );
      
    
}

export default Principal;