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
        console.log('Botón 1 fue pulsado');
        navigate(process.env.PUBLIC_URL+'/partidaPublica');
    };
    
    const handleClick2 = () => {
        console.log('Botón 2 fue pulsado');
        navigate(process.env.PUBLIC_URL+'/partidaPrivada');
    };
    const cookies= new Cookies();
    return (
        <>
        <h1>BIENVENIDO {cookies.get('nombreUsuario')}</h1>
        
        <button>Datos personales</button>
        <button>Amigos</button>
        <button>Torneos</button>
        <button>Rankings</button>
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