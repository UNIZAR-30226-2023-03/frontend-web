import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Registrarse.css";
import Cookies from 'universal-cookie';

function EnviarCorreo() {
  const cookies= new Cookies();
  const navigate = useNavigate();
  const [erroremail, seterroremail] = useState("");
  const [email, setemail] = useState('');
  const [mostrarconfirmacion, setmostrarconfirmacion] = useState(false);
  async function esperarysalir(){
    await new Promise(resolve => setTimeout(resolve, 8000));
    navigate(process.env.PUBLIC_URL+'/');
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("enviando correo: "+email);
    await axios.post("https://lamesa-backend.azurewebsites.net/usuario/recuperar-password?email="+email)
    .then ( response => {
      cookies.set('correoUsuario',email,{path: '/'});
      setmostrarconfirmacion(true);
      esperarysalir();
    }) 
    .catch(error => {
      console.log("ERROR");
      seterroremail(error.response.data);
    })  
  };

  return (
    <div className="containerRegistro">
        <form onSubmit={handleSubmit} className="formRegistro">
        <h1>Recuperar contraseña</h1>
        {mostrarconfirmacion ? (
        <p className="confirmacion">Mensaje enviado correctamente, <br></br> revisa tu correo electrónico</p>
        ) : (
        <>
        <p>Las instrucciones para poder cambiar tu contraseña <br></br> se enviarán a tu correo electrónico</p>
          <label>
            <p className="textoRegistro">Introduce tu <br></br>correo electrónico:</p>
            <input type="text" value={email} required onChange={(e) => setemail(e.target.value)} />
          </label>
          <br/> <br/> <br/>
          <p></p>
          <button type="submit" className="botonRegistro">Enviar correo electrónico</button>
          <p className="mensajeError">{erroremail}</p>
        </>
          )}
        </form>
    
    </div>

  );
}

export default EnviarCorreo;

