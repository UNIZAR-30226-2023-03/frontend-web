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
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [error4, setError4] = useState(false);
    const [error5, setError5] = useState(false);  
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
        await axios.post("https://lamesa-backend.azurewebsites.net/partida/conectar", {nombre:nombrePartida, password:codigoPartida,jugador})
        .then(response =>{
            let id_part = response.data.id;
            let col = response.data.color;
            let jug = response.data.jugadores;
            navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug } });
        })
        .catch(error => {
            if(error.response.data==="Ya estás jugando una partida"){
              setError1(true);
              setError2(false);
              setError3(false);
              setError4(false);
            }
            else if (error.response.data==="La partida no existe o está ya en curso"){
              setError2(true);
              setError3(false);
              setError1(false);
              setError4(false);
            }
            else if (error.response.data==="Contraseña incorrecta para la sala indicada"){
                setError2(false);
                setError3(false);
                setError1(false);
                setError4(true);
            }
        })
               
    };

    const handleSubmit1 = async (event) => {
        event.preventDefault();
        await axios.post("https://lamesa-backend.azurewebsites.net/partida/crear", {nombre, password, jugador, configuracionB, configuracionF})
        .then(response => {
            let id_part = response.data.id;
            let col = response.data.color;
            let jug = response.data.jugadores;
            navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug } }); 
        })
        .catch(error =>{
            if(error.response.data==="Nombre de sala no disponible: ya se está jugando una partida con ese nombre de sala"){
                setError1(false);
                setError2(false);
                setError3(false);
                setError4(false);
                setError5(true);
            }
            else if (error.response.data==="Ya estás jugando una partida"){
                setError2(false);
                setError3(true);
                setError1(false);
                setError4(false);
            }

        })
                             
    };

    return(
        <div>
            <h1>UNIRSE A UN PARTIDA PRIVADA</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Introduce el nombre de la partida privada:</p>
                    <input type="text" placeholder="Nombre de la partida privada"
                    value={nombrePartida} required onChange={handleNombreChange} />
                    <p className={error2 ? 'error2' : 'error2In'}>La partida no existe o ya esta en curso </p>
                </label>
                <label>
                    <p>Introduce el código de la partida privada:</p>
                    <input type="text" placeholder="Código de la partida privada"
                    value={codigoPartida} required onChange={handleCodigoChange} />
                    <p className={error4 ? 'error4' : 'error4In'}>Contraseña incorrecta para la sala indicada </p>
                    <p className={error1 ? 'error1' : 'error1In'}>Ya estás jugando una partida </p>
                </label>
                <button type="submit">Unirme</button>
            </form>
            <h1>CREAR UN PARTIDA PRIVADA</h1>
            <div className='container'>
                
                        <p>Introduce el nombre de la partida privada:</p>
                        <input type="text" placeholder="Nombre de la partida privada"
                        value={nombre} required onChange={handleNombreNuevoChange} />
                        <p className={error5 ? 'error5' : 'error5In'}>Nombre de sala no disponible: ya se está jugando una partida con ese nombre de sala </p>
                
                
                        <p>Introduce el código de la partida privada:</p>
                        <input type="text" placeholder="Código de la partida privada"
                        value={password} required onChange={handleCodigoNuevoChange} />
                        <p className={error3 ? 'error3' : 'error3In'}>Ya estás jugando una partida </p>
                
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