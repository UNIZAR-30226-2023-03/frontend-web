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
    const response = await axios.post("https://backend-sy93.onrender.com/usuarios/login", {login, password});
    console.log(response.data);
    // Validar la entrada del usuario aquí

    // Enviar datos al servidor aquí
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <h1>Inicio de sesion</h1>
      <label>
        Usuario:
        <input type="text" placeholder="correo electronico o nombre de usuario"
          value={login} required onChange={handleUsernameChange} />
      </label>
      <br/>
      <label>
        Contraseña:
        <input type="password" placeholder='contraseña' required value={password} onChange={handlePasswordChange} />
      </label>
      ¿Aún no tienes cuenta?
      <Link to='/registrarse'>Regístrate aquí</Link>
      <br/>
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm;