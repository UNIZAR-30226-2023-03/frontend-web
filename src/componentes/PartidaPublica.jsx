import React, { useState } from 'react';
import "../styles/PartidaPublica.css";
import axios from 'axios';
import home from "../imagenes/iconos/home.svg"
import Cookies from 'universal-cookie';

import { useNavigate } from 'react-router-dom';

function PartidaPublica(){
    const [partidaMod, setPartidaMod] = useState('NORMAL');
    const [partidaBar, setPartidaBar] = useState('SOLO_SEGUROS');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const cookies= new Cookies();
    const id = cookies.get('idUsuario');
    const handleClick1 = () => {
        setPartidaMod('NORMAL')
    };
    
    const handleClick2 = () => {
        setPartidaMod('RAPIDA')
    };

    const handleClick3 = () => {
        setPartidaBar('SOLO_SEGUROS')
    };
    
    const handleClick4 = () => {
        setPartidaBar('TODAS_CASILLAS')
    };

    const handleSubmit1 = async (event) => {
        event.preventDefault();
        await axios.post("https://lamesa-backend.azurewebsites.net/partida/publica", {jugador:id, configuracionB:partidaBar, configuracionF:partidaMod})
        .then(response => {
            let id_part = response.data.id;
            let col = response.data.color;
            let jug = response.data.jugadores;
            let tipo = "publica";
            let num_fichas = partidaMod;
            navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo,num_fichas } });
        })
        .catch(error =>{
            setError(true)
        })
         
    };
    return(
  

        <div className='todo1'>
            <div className="back1">
                <div class="breadcrumb">
                <div class="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
                <div class="breadcrumb-item">&gt;</div>
                <div class="breadcrumb-item">Datos Personales</div>
                </div>
            </div>
            <p className='textocrear'>UNIRSE A UNA PARTIDA PúBLICA</p>
               <div className="container">
                    <div className="rapida">
                            <button className={partidaMod==="NORMAL" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick1}>Partida normal</button> 
                            <button className={partidaMod === "RAPIDA" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick2}>Partida rápida</button> 
                    </div>
                    <div className="barrera">
                            <button className={partidaBar==="SOLO_SEGUROS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick3}>Partida con barreras normales</button> 
                            <button className={partidaBar==="TODAS_CASILLAS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick4}>Partida con barreras en todas las casillas</button> 
                    </div>
                    <p className={error ? 'error' : 'errorIn'}>Ya estás jugando una partida</p>
                </div>
                
                <form onSubmit={handleSubmit1}>
                    <button className='bott' type="submit">Crear partida</button>
                </form>
        </div>
    );
}

export default PartidaPublica;