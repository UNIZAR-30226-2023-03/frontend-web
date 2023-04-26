import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
//import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/Amigos.css";
import home from "../imagenes/iconos/home.svg";
import { Button, Modal } from 'react-bootstrap';


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
  const [showModalBuscarAmigo, setShowModalBuscarAmigo] = useState(false);
  const [showModalSolicitudes, setShowModalSolicitudes] = useState(false);

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
    seterrorenviosolicitud(false);
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

  
        <Button onClick={() => {
          setShowModalSolicitudes(true);
          setShowModalBuscarAmigo(false);
          consultarSolicitudes(idUsuario, setsolicitudes);
          }}>Solicitudes de amistad</Button>
        <Modal 
          show={showModalSolicitudes} 
          onHide={() => {setShowModalSolicitudes(false);setShowModalBuscarAmigo(false)}} 
          centered
          className="custom-modal-solicitudes"
        >
          <Modal.Header>
            <Button className="cerrarModal" onClick={() => {
              setShowModalSolicitudes(false);
              setShowModalBuscarAmigo(false);
              seterrorenviosolicitud(false);
            }}>X</Button>
          <Modal.Title className="modalTitle">Solicitudes pendientes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {/* {solicitudes.map((solicitud, index) => (
            <div key={index} className="amigosdisponibles">
              <table>
              <tr>
                <td className="nombre-amigo">{solicitud.username}</td>
                <td ><button onClick={() => aceptarSolicitud(idUsuario,solicitud.id,setaceptarsolicitud)}>Aceptar</button></td>
                <td ><button onClick={() => rechazarSolicitud(idUsuario,solicitud.id,setrechazarsolicitud)}>Rechazar</button></td>
              </tr>
              </table>
            </div>
          ))} */}
            <div>
              <table className="solicitudes">
              <tr>
                <td className="nombre-amigo">solicitud.username</td>
                <td ><button type="button" class="btn btn-success">Success</button></td>

                <td ><button className="aceptarSol" >Aceptar</button></td>
                <td ><button className="rechazarSol" >Rechazar</button></td>
              </tr>
              </table>
            </div>
          {aceptarsolicitud && <p>Solicitud aceptada correctamente</p>}
         {rechazarsolicitud && <p>Solicitud rechazada con éxito</p>}  
          </Modal.Body>
        </Modal>

        <Button onClick={() => {setShowModalBuscarAmigo(true);setShowModalSolicitudes(false);}}>BUSCAR AMIGOS</Button>
        <Modal 
          show={showModalBuscarAmigo} 
          onHide={() => setShowModalBuscarAmigo(false)} 
          centered
          className="custom-modal"
        >
          <Modal.Header>
          <Button className="cerrarModal" onClick={() => {
            setShowModalBuscarAmigo(false);
            seterrorenviosolicitud(false);
          }}>X</Button>
          <Modal.Title className="modalTitle">Introduce el nombre de tu amigo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="modalForm"  onSubmit={handleSubmit}>
              <input type="text" onChange={(e) => setusernamebuscar(e.target.value)}
                value={usernamebuscar} placeholder="Escribir nombre de usuario..." />
              <Button type="submit">Enviar solicitud de amistad</Button>
            </form>
            {errorenviosolicitud && <p className="mensajeError">El nombre de usuario introducido no existe</p>}
          </Modal.Body>
        </Modal>
      </>
    );
}

export default Amigos;