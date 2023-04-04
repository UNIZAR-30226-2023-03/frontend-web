import React, { useState } from 'react';
import "../styles/PartidaPublica.css";
import axios from 'axios';
import Cookies from 'universal-cookie';

//import { useNavigate } from 'react-router-dom';

function PartidaPublica(){

    const [idPartida, setPartidaId] = useState('');
    const [color, setColor] = useState('');
    const [partidaMod, setPartidaMod] = useState('NORMAL');
    const [partidaBar, setPartidaBar] = useState('SOLO_SEGUROS');
    const cookies= new Cookies();
    const id = cookies.get('idUsuario');
    const handleClick1 = () => {
        console.log('normal')
        setPartidaMod('NORMAL')
    };
    
    const handleClick2 = () => {
        console.log('rapidaa')
        setPartidaMod('RAPIDA')
    };

    const handleClick3 = () => {
        console.log('solo seg')
        setPartidaBar('SOLO_SEGUROS')
    };
    
    const handleClick4 = () => {
        console.log('todas ')
        setPartidaBar('TODAS_CASILLAS')
    };

    const handleSubmit1 = async (event) => {
        event.preventDefault();
        console.log('Crear partida')
        const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/publica", {id,partidaMod,partidaBar});
        console.log(response.data);
        setPartidaId(response.data.id_partida);
        setColor(response.data.color_jugador);
        console.log(idPartida);
        console.log(color);
    };
    return(
        <div>
            <h1>CREAR UN PARTIDA PUBLICA</h1>
               <div className="container">
                    <div className="botonesRapida1">
                            <button className={partidaMod==="NORMAL" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick1}>Partida Rapida</button> 
                            <button className={partidaMod === "RAPIDA" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick2}>Partida Normal</button> 
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