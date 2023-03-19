import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registrarse() {
  const navigate = useNavigate();
  const [username, setLogin] = useState('');
  const [password_1, setPassword1] = useState('');
  const [password_2, setPassword2] = useState('');
  const [email, setEmail] = useState('');

  const handleUsernameChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };

  const handlePassword2Change = (event) => {
    setPassword2(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username, email, password_1, password_2);
    try{
      const response = await axios.post("https://lamesa-backend.azurewebsites.net/usuarios", {username, email, password_1});
      console.log(response.data);
      if (response.data){
        navigate(process.env.PUBLIC_URL+'/principal');
      }
    }catch(error){
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear cuenta</h1>
      <p>Para poder crear una cuenta, debes introducir los siguientes datos</p>
      <label>
        Nombre de usuario:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <br/>
      <label>
        Correo electrónico:
        <input type="text" value={email} onChange={handleEmailChange} />
      </label>
      <br/>
      <label>
        Contraseña:
        <input type="password" value={password_1} onChange={handlePassword1Change} />
      </label>
      <br/>
      <label>
        Repite la contraseña:
        <input type="password" value={password_2} onChange={handlePassword2Change} />
      </label>
      <br/>
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Registrarse;
