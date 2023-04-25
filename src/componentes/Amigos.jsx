import React, { useState, useEffect} from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
//import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/Amigos.css";
import home from "../imagenes/iconos/home.svg"


async function eliminarAmigo(amigo,yo){
  //const response = await axios.post("https://lamesa-backend.azurewebsites.net/usuario/eliminar-amigo", {usuario: yo,amigo});  
}

function Amigos(){
  const [amigosactuales, setamigosactuales] = useState([]);
  const cookies= new Cookies();
  const idUsuario = cookies.get('idUsuario');
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
              <td className="nombre-amigo">amigo.username</td>
              <td ><button onClick={() => eliminarAmigo(amigo.id, idUsuario)}>Eliminar Amigo</button></td>
            </tr>
            </table>
          </div>
        ))}
      </>
    );
}

export default Amigos;