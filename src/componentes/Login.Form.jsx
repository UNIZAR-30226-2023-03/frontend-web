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
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);

  const handleUsernameChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("https://lamesa-backend.azurewebsites.net/usuario/login", {login, password})
      .then ( response => {
        const cookies = new Cookies();
        cookies.set('idUsuario',response.data.id,{path: '/'})
        cookies.set('nombreUsuario',response.data.username,{path: '/'})
        cookies.set('correoUsuario',response.data.email,{path: '/'})
        navigate(process.env.PUBLIC_URL+'/principal');
      })
      .catch(error => {
        if(error.response.data==="El usuario no existe"){
          setError1(true);
          setError2(false);
        }
        else if (error.response.data==="La contraseña no es correcta"){
          setError2(true);
          setError1(false);
        }
      })

  };

  return (
    <div className="containerinicioSesion">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Inicio de sesión</h1>
        <label>
        <p className="textoIniciarSesion">Usuario:</p>
          <input className='inp' type="text" placeholder="Correo electrónico o nombre de usuario"
            value={login} required onChange={handleUsernameChange} />
          <p className={error1 ? 'error1' : 'error1In'}>El usuario no existe </p>
        </label>
        <label>
        <p className="textoIniciarSesion">Contraseña:</p>
          <input className='inp' type="password" placeholder='Contraseña' required value={password} onChange={handlePasswordChange} />
          <p className={error2 ? 'error2' : 'error2In'}>La contraseña es incorrecta </p>
        </label>        
        <button type="submit">Iniciar sesión</button>
        <p></p>
        <Link to='/enviaremail'>¿Has olvidado la contraseña?</Link>
        <p></p>
        <p className="textoSinIniciarSesion">¿Aún no tienes cuenta?</p>
        <Link className="iraregistro" to='/registrarse'>Regístrate aquí</Link>
        <br/>
      </form>
    </div>
  
  );
}

export default LoginForm;
