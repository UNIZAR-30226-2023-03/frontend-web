import React, { useState } from 'react';
import "../styles/PartidaPrivada.css";
//import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

function PartidaPrivada(){

    const [partidaMod, setPartidaMod] = useState(true);
    const [partidaBar, setPartidaBar] = useState(true);
    const [nombrePartida, setnombrePartida] = useState('');
    const [codigoPartida, setcodigoPartida] = useState('');
    const [nombrePartidaNueva, setnombrePartidaNueva] = useState('');
    const [codigoPartidaNueva, setcodigoPartidaNueva] = useState('');   
    
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
        setPartidaMod(true)
    };
    
    const handleClick2 = () => {
        setPartidaMod(false)
    };

    const handleClick3 = () => {
        setPartidaBar(true)
    };
    
    const handleClick4 = () => {

        setPartidaBar(false)
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('unirme')
        //enviar datos y esperar respuesta
    
    };
    const handleSubmit1 = async (event) => {
        event.preventDefault();
        console.log('Crear partida')
        //enviar datos y esperar respuesta
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
            <form onSubmit={handleSubmit1}>
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
                        <button className={partidaMod ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick1}>Partida Rapida</button> 
                        <button className={!partidaMod ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick2}>Partida Normal</button> 
                </div>
                <div className="botonesBarrera">
                        <button className={partidaBar ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick3}>Partida Con Barreras</button> 
                        <button className={!partidaBar ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick4}>Partida Sin Barreras</button> 
                </div>
                <button type="submit">Crear partida</button>
            </form>
        </div>
    );
}

export default PartidaPrivada;