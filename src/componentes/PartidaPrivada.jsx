import React, { useState } from 'react';
import "../styles/PartidaPrivada.css";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

function PartidaPrivada(){
    const [configuracionF, setconfiguracionF] = useState("NORMAL");
    const [configuracionB, setconfiguracionB] = useState("SOLO_SEGUROS");
    const [nombrePartida, setnombrePartida] = useState('');
    const [codigoPartida, setcodigoPartida] = useState('');
    const [nombre, setnombrePartidaNueva] = useState('');
    const [password, setcodigoPartidaNueva] = useState('');   
    const cookies= new Cookies();
    const jugador = cookies.get('idUsuario');
    const navigate = useNavigate();
    
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
        setconfiguracionF("NORMAL")
    };
    
    const handleClick2 = () => {
        setconfiguracionF("RAPIDA")
    };

    const handleClick3 = () => {
        setconfiguracionB("SOLO_SEGUROS")
    };
    
    const handleClick4 = () => {

        setconfiguracionB("TODAS_CASILLAS")
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('unirme')
        //enviar datos y esperar respuesta
        const response = await axios.post("http://localhost:8080/partida/conectar", {nombre:nombrePartida, password:codigoPartida,jugador});
        let id_part = response.data.id;
        let col = response.data.color;
        navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col } });     
        
 
        
    };

    const handleSubmit1 = async (event) => {
        event.preventDefault();
        const response = await axios.post("http://localhost:8080/partida/crear", {nombre, password, jugador, configuracionB, configuracionF});
        let id_part = response.data.id;
        let col = response.data.color;
        navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col } });                              
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
                        value={nombre} required onChange={handleNombreNuevoChange} />
                </label>
                <label>
                        <p>Introduce el código de la partida privada:</p>
                        <input type="text" placeholder="Código de la partida privada"
                        value={password} required onChange={handleCodigoNuevoChange} />
                </label>
                <div className="botonesRapida">
                            <button className={configuracionF==="NORMAL" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick1}>Partida Normal</button> 
                            <button className={configuracionF==="RAPIDA" ? 'BotonPartidaRapidaAc' : 'BotonPartidaRapidaIn'} onClick={handleClick2}>Partida Rapida</button> 
                </div>
                    <div className="botonesBarrera">
                            <button className={configuracionB==="SOLO_SEGUROS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick3}>Partida Con Barreras Normales</button> 
                            <button className={configuracionB==="TODAS_CASILLAS" ? 'BotonPartidaBarAc' : 'BotonPartidaBarIn'} onClick={handleClick4}>Partida Con Barreras En todas las casillas</button> 
                </div>
            </div>
            <form onSubmit={handleSubmit1}>
                <button type="submit">Crear partida</button>
            </form>
        </div>
    );
}

export default PartidaPrivada;