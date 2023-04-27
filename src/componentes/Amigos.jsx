import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Amigos.css";
import home from "../imagenes/iconos/home.svg";
import { Button, Modal } from 'react-bootstrap';


async function eliminarAmigo(amigo,yo,setamigoeliminado){
  await axios.post("https://lamesa-backend.azurewebsites.net/usuario/eliminar-amigo", {usuario: yo,amigo});  
  setamigoeliminado(true);
}
async function aceptarSolicitud(yo,amigo,setaceptarsolicitud,setShowModalSolicitudes){
  console.log("aceptar solicitud con "+yo+","+amigo);
  await axios.post("https://lamesa-backend.azurewebsites.net/usuario/aceptar-solicitud", {usuario: yo,amigo});  
  setaceptarsolicitud(true);
  setShowModalSolicitudes(false);
}
async function rechazarSolicitud(yo,amigo,setrechazarsolicitud,setShowModalSolicitudes){
  console.log("rechazar solicitud con "+yo+","+amigo);
  await axios.post("https://lamesa-backend.azurewebsites.net/usuario/denegar-solicitud", {usuario: yo,amigo});  
  setrechazarsolicitud(true);
}

async function consultarSolicitudes(yo,setsolicitudes){
  console.log("consultar solicitudes")
  const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/solicitudes/"+yo);  
  const solicitudes = response.data;
  console.log("solicitudes",response.data);
  const sol = [];
    solicitudes.forEach(solicitud => {
      sol.push(solicitud); 
    });
    setsolicitudes(sol);
}

async function enviarSolicitud(yo, nombre,seterrorenviosolicitud){
  try {
    console.log("buscar usuario",nombre);
    const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/obtener-id?name=" + nombre);
    const id = response.data;
    console.log("id obtenido",id);
    await axios.post("https://lamesa-backend.azurewebsites.net/usuario/enviar-solicitud", { usuario: yo, amigo: id });
  } catch (error) {
    seterrorenviosolicitud(true);
  }
  
}

function Amigos(){
  const navigate = useNavigate();
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

  async function apuntarseaPartida(idUsuario,idPartida){
    const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/conectar-amigo", {jugador: idUsuario,partida: idPartida});  
    let id_part = response.data.id;
    let col = response.data.color;
    let jug = response.data.jugadores;
    let tipo = "PRIVADA";
    navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo } });
  }
  useEffect(() => {
    async function buscaramigosactuales() {
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/amigos/"+idUsuario);
      const amigos = response.data;
      console.log("amigos actuales",amigos)
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
    setusernamebuscar("");
  }

    return( 
      <>
        <div>
          <div className="back4">
            <div className="breadcrumb">
              <div className="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div className="breadcrumb-item">&gt;</div>
              <div className="breadcrumb-item">Amigos</div>
            </div>
          </div>              
        </div>
        <h1>MIS AMIGOS</h1>
        {amigosactuales.map((amigo, index) => (
          <div key={index} className="amigosDisponibles">
            <table>
            <tr>
              <td>{amigo.username}</td>
              {amigo.estado === "ESPERANDO JUGADORES" &&
               <td><button onClick={() => apuntarseaPartida(idUsuario,amigo.idPartida)}>¡Únete a su partida!</button></td>
              }
              {amigo.estado === "EN_PROGRESO" &&
               <td><p>Está jugando una partida ahora mismo</p></td>
              }
              <td><button onClick={() => eliminarAmigo(amigo.id, idUsuario,setamigoeliminado)}>Eliminar Amigo</button></td>
            </tr>
            </table>
          </div>
        ))}
        {amigoeliminado && <p>Amigo eliminado correctamente</p>}

        {showModalSolicitudes && <div className="fondo-negro"></div>}
        {showModalBuscarAmigo && <div className="fondo-negro"></div>}
        <Button className="solicitudesboton" onClick={() => {
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
          {solicitudes.map((solicitud, index) => (
            <div key={index} className="amigosdisponibles">
              <table className="solicitudes">
              <tr>
                <td className="nombre-amigo">{solicitud.username} ha solicitado seguirte</td>
                <td ><button className="aceptarSol" onClick={() => aceptarSolicitud(idUsuario,solicitud.id,setaceptarsolicitud,setShowModalSolicitudes)}>Aceptar</button></td>
                <td ><button className="rechazarSol" onClick={() => rechazarSolicitud(idUsuario,solicitud.id,setrechazarsolicitud,setShowModalSolicitudes)}>Rechazar</button></td>
              </tr>
              </table>
            </div>
          ))}  
          </Modal.Body>
        </Modal>
        {aceptarsolicitud && <p className="mensajeConfirmacion">Solicitud aceptada correctamente</p>}
        {rechazarsolicitud && <p>Solicitud rechazada con éxito</p>}
        <p className="mensajeConfirmacion">Solicitud aceptada correctamente</p>

        <Button className="solicitudesboton" onClick={() => {setShowModalBuscarAmigo(true);setShowModalSolicitudes(false);}}>BUSCAR AMIGOS</Button>
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