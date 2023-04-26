import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
//import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/Amigos.css";
import home from "../imagenes/iconos/home.svg"


async function eliminarAmigo(amigo,yo,setamigoeliminado){
  await axios.post("https://lamesa-backend.azurewebsites.net/usuario/eliminar-amigo", {usuario: yo,amigo});  
  setamigoeliminado(true);
}
async function aceptarSolicitud(yo,amigo,setaceptarsolicitud){
  await axios.post("https://lamesa-backend.azurewebsites.net/usuario/aceptar-solicitud", {usuario: yo,amigo});  
  setaceptarsolicitud(true);
}
async function rechazarSolicitud(yo,amigo,setrechazarsolicitud){
  await axios.post("https://lamesa-backend.azurewebsites.net/usuario/denegar-solicitud", {usuario: yo,amigo});  
  setrechazarsolicitud(true);
}

async function consultarSolicitudes(yo,setsolicitudes){
  const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/solicitudes" + yo);  
  const solicitudes = response.data;
  const sol = [];
    solicitudes.forEach(solicitud => {
      sol.push(solicitud); 
    });
    setsolicitudes(sol);
}

async function enviarSolicitud(yo, nombre,seterrorenviosolicitud){
  try {
    const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/obtener-id/?name=" + nombre);
    const id = response.data;
    await axios.post("https://lamesa-backend.azurewebsites.net/usuario/enviar-solicitud", { usuario: yo, amigo: id });
  } catch (error) {
    seterrorenviosolicitud(true);
  }
  
}

function Amigos(){
  const [amigosactuales, setamigosactuales] = useState([]);
  const [solicitudes, setsolicitudes] = useState([]);
  const [aceptarsolicitud, setaceptarsolicitud] = useState(false);
  const [rechazarsolicitud, setrechazarsolicitud] = useState(false);
  const cookies= new Cookies();
  const idUsuario = cookies.get('idUsuario');
  const [amigoeliminado, setamigoeliminado] = useState(false);
  const [usernamebuscar, setusernamebuscar] = useState("");
  const [errorenviosolicitud, seterrorenviosolicitud] = useState("");

  useEffect(() => {
    async function buscaramigosactuales() {
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuarios/amigos/"+idUsuario);
      const amigos = response.data;
      const amigosact = [];
      amigos.forEach(amigo => {
        amigosact.push(amigo); 
      });
      setamigosactuales(amigosact);
    }
    buscaramigosactuales(); 
  }, [idUsuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarSolicitud(idUsuario,usernamebuscar,seterrorenviosolicitud);
  }

    return( 
      <>
        <div>
          <div className="back4">
            <div class="breadcrumb">
              <div class="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div class="breadcrumb-item">&gt;</div>
              <div class="breadcrumb-item">Amigos</div>
            </div>
          </div>              
        </div>
        <h1>MIS AMIGOS</h1>
        {amigosactuales.map((amigo, index) => (
          <div key={index} className="amigosdisponibles">
            <table>
            <tr>
              <td className="nombre-amigo">{amigo.username}</td>
              <td ><button onClick={() => eliminarAmigo(amigo.id, idUsuario,setamigoeliminado)}>Eliminar Amigo</button></td>
            </tr>
            </table>
          </div>
        ))}
        {amigoeliminado && <p>Amigo eliminado correctamente</p>}
        <button onClick={() => consultarSolicitudes(idUsuario,setsolicitudes)}>Solicitudes de amistad</button>
        <h1>SOLICITUDES</h1>
        {solicitudes.map((solicitud, index) => (
          <div key={index} className="amigosdisponibles">
            <table>
            <tr>
              <td className="nombre-amigo">{solicitud.username}</td>
              <td ><button onClick={() => aceptarSolicitud(idUsuario,solicitud.id,setaceptarsolicitud)}>Aceptar</button></td>
              <td ><button onClick={() => rechazarSolicitud(idUsuario,solicitud.id,setrechazarsolicitud)}>Rechazar</button></td>
            </tr>
            </table>
          </div>
        ))}    
        {aceptarsolicitud && <p>Solicitud aceptada correctamente</p>}
        {rechazarsolicitud && <p>Solicitud rechazada con éxito</p>}
        <button>BUSCAR AMIGOS</button>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={(e) => setusernamebuscar(e.target.value)}
          value={usernamebuscar} placeholder="Escribir mensaje..."/>
          <button>Buscar</button>
        </form>
        {errorenviosolicitud && <p>El nombre de usuario introducido no existe</p>}
      </>
    );
}

export default Amigos;