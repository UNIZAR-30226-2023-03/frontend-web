import React, { useState } from 'react';
import "../styles/PartidaPrivada.css";
import axios from 'axios';
import Cookies from 'universal-cookie';

//import { useNavigate } from 'react-router-dom';

function PartidaPrivada(){
    const [idPartida, setPartidaId] = useState('');
    const [color, setColor] = useState('');
    const [partidaMod, setPartidaMod] = useState('NORMAL');
    const [partidaBar, setPartidaBar] = useState('SOLO_SEGUROS');
    const [nombrePartida, setnombrePartida] = useState('');
    const [codigoPartida, setcodigoPartida] = useState('');
    const [nombrePartidaNueva, setnombrePartidaNueva] = useState('');
    const [codigoPartidaNueva, setcodigoPartidaNueva] = useState('');   
    const cookies= new Cookies();
    const id = cookies.get('idUsuario');
    
    const handleNombreChange = (event) => {
        setnombrePartida(event.target.value);
    };
    
    const handleCodigoChange = (event) => {
        setcodigoPartida(event.target.value);
    };
    const handleNombreNuevoChange = (event) => {
        setnombrePartidaNueva(event.target.value);
    };
    
    const handleCodigoNuevoChange = (event) => {
        setcodigoPartidaNueva(event.target.value);
    };
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
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('unirme')
        //enviar datos y esperar respuesta
        const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/conectar", {nombrePartida, codigoPartida,id});
        console.log(response.data);
        setPartidaId(response.data.id_partida)
        setColor(response.data.color_jugador)
        console.log(idPartida)
        console.log(color)
        
    };

    const handleSubmit1 = async (event) => {
        event.preventDefault();
        console.log('Crear partida')
        const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/conectar", {nombrePartida, codigoPartida,id,partidaMod,partidaBar});
        console.log(response.data);
        setPartidaId(response.data.id_partida);
        setColor(response.data.color_jugador);
        console.log(idPartida);
        console.log(color);
    };

    return(
        <div>
            <h1>UNIRSE A UN PARTIDA PRIVADA</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Introduce el nombre de la partida privada:</p>
                    <input type="text" placeholder="Nombre de la partida privada"
                    value={nombrePartida} required onChange={handleNombreChange} />
                </label>
                <label>
                    <p>Introduce el código de la partida privada:</p>
                    <input type="text" placeholder="Código de la partida privada"
                    value={codigoPartida} required onChange={handleCodigoChange} />
                </label>
                <button type="submit">Unirme</button>
            </form>
            <h1>CREAR UN PARTIDA PRIVADA</h1>
            <div className='container'>
                <label>
                        <p>Introduce el nombre de la partida privada:</p>
                        <input type="text" placeholder="Nombre de la partida privada"
                        value={nombrePartidaNueva} required onChange={handleNombreNuevoChange} />
                </label>
                <label>
                        <p>Introduce el código de la partida privada:</p>
                        <input type="text" placeholder="Código de la partida privada"
                        value={codigoPartidaNueva} required onChange={handleCodigoNuevoChange} />
                </label>
                <div className="botonesRapida">
                            <button className={partidaMod==="NORMAL" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick1}>Partida Rapida</button> 
                            <button className={partidaMod==="RAPIDA" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick2}>Partida Normal</button> 
                </div>
                    <div className="botonesBarrera">
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

export default PartidaPrivada;