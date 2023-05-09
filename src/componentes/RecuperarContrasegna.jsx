import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "../styles/Registrarse.css";
function RecuperarContrasegna() {
  const navigate = useNavigate();
  const [errorcambiocontrasegna, seterrorcambiocontrasegna] = useState("");
  const [password1, setpassword1] = useState('');
  const [password2, setpassword2] = useState('');
  const cookies= new Cookies();
  const idUsuario = cookies.get('idUsuario');
  let token;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(password1!==password2){
      seterrorcambiocontrasegna("Las contraseñas no coinciden");
    }
    else{
      await axios.post("https://lamesa-backend.azurewebsites.net/usuario/validar-codigo", {usuario: idUsuario, token:token, password: password1})
      .then ( response => {
        navigate(process.env.PUBLIC_URL+'/recuperarcontraseña');
      }) 
      .catch(error => {
        seterrorcambiocontrasegna(error.response.data);
      })
    }
    

  };

  return (
    <div className="containerRegistro">
      <form onSubmit={handleSubmit} className="formRegistro">
        <h1>Recuperar contraseña</h1>
        <label>
        <p className="textoRegistro">Introduce la nueva contraseña:</p>
          <input type="text" value={password1} required onChange={(e) => setpassword1(e.target.value)} />
        </label>
        <br/>
        <label>
        <p className="textoRegistro">Repite la contraseña anterior:</p>
          <input type="text" value={password2} required onChange={(e) => setpassword2(e.target.value)} />
        </label>
        <br/>
        <p className="mensajeError">{errorcambiocontrasegna}</p>
        <button type="submit" className="botonRegistro">Cambiar contraseña</button>
      </form>
    </div>
  );
}

export default RecuperarContrasegna;

