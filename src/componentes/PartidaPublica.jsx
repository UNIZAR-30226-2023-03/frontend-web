import React, { useState } from 'react';
import "../styles/PartidaPublica.css";
import axios from 'axios';
import Cookies from 'universal-cookie';

import { useNavigate } from 'react-router-dom';

function PartidaPublica(){
    const [partidaMod, setPartidaMod] = useState('NORMAL');
    const [partidaBar, setPartidaBar] = useState('SOLO_SEGUROS');
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
        const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/publica", {jugador:id, configuracionB:partidaBar, configuracionF:partidaMod});
        console.log(response.data);
        let id_part = response.data.id;
        let col = response.data.color;
        navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col } }); 
    };
    return(
        <div>
            <h1>CREAR UN PARTIDA PUBLICA</h1>
               <div className="container">
                    <div className="botonesRapida1">
                            <button className={partidaMod==="NORMAL" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick1}>Partida Normal</button> 
                            <button className={partidaMod === "RAPIDA" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick2}>Partida Rapida</button> 
                    </div>
                    <div className="botonesBarrera1">
                            <button className={partidaBar==="SOLO_SEGUROS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick3}>Partida Con Barreras Normales</button> 
                            <button className={partidaBar==="TODAS_CASILLAS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick4}>Partida Con Barreras En todas las casillas</button> 
                    </div>
                </div>
                <form onSubmit={handleSubmit1}>
                    <button type="submit">Crear partida</button>
                </form>
        </div>
    );
}

export default PartidaPublica;