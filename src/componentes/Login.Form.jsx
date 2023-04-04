import React, { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "../styles/InicioSesion.css";

function LoginForm() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post("https://lamesa-backend.azurewebsites.net/usuario/login", {login, password});
    console.log(response.data);
    if (response.data){
      const cookies = new Cookies();
      cookies.set('idUsuario',response.data,{path: '/'})
      cookies.set('nombreUsuario',login,{path: '/'})
      navigate(process.env.PUBLIC_URL+'/principal');
    }

  };

  return (
    <div className="containerinicioSesion">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Inicio de sesión</h1>
        <label>
        <p className="textoIniciarSesion">Usuario:</p>
          <input type="text" placeholder="Correo electrónico o nombre de usuario"
            value={login} required onChange={handleUsernameChange} />
        </label>
        <br/>
        <label>
        <p className="textoIniciarSesion">Contraseña:</p>
          <input type="password" placeholder='Contraseña' required value={password} onChange={handlePasswordChange} />
        </label>
        <button type="submit">Iniciar sesión</button>
        <p className="textoSinIniciarSesion">¿Aún no tienes cuenta?</p>
        <Link to='/registrarse'>Regístrate aquí</Link>
        <br/>
      </form>
    </div>
  
  );
}

export default LoginForm;
