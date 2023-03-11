import React, { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

function LoginForm() {
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
    console.log(login, password);
    try{
      const response = await axios.post("https://backend-sy93.onrender.com/usuarios/login", {login, password});
      console.log(response.data);
    }catch(error){
      console.error(error);
    }
    // Validar la entrada del usuario aquí

    // Enviar datos al servidor aquí
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <h1>Inicio de sesion</h1>
      <label>
        Usuario:
        <input type="text" value={login} onChange={handleUsernameChange} />
      </label>
      <br/>
      <label>
        Contraseña:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <h2>Inicio de sesion</h1>
      <Link to='/registrarse'>Registrarse</Link>
      <br/>
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm;