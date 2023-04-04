import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "../styles/Registrarse.css";
function Registrarse() {
  const navigate = useNavigate();
  const [username, setLogin] = useState('');
  const [password, setPassword1] = useState('');
  const [password_2, setPassword2] = useState('');
  const [email, setEmail] = useState('');

  const handleUsernameChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };

  const handlePassword2Change = (event) => {
    if(password!==password_2){
      console.log('no igual') 
    }
    setPassword2(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username, email, password, password_2);
    //si password no coinciden no enviar
      const response = await axios.post("https://lamesa-backend.azurewebsites.net/usuario/crear", {email,username, password});
      console.log(response.data.id);
      console.log(response.data);
      if (response.data){
        const cookies = new Cookies();
        cookies.set('idUsuario',response.data.id,{path: '/'})
        cookies.set('nombreUsuario',username,{path: '/'})
        navigate(process.env.PUBLIC_URL+'/principal');
      }
      
  };

  return (
    <div className="containerRegistro">
      <form onSubmit={handleSubmit} className="formRegistro">
        <h1>Crear cuenta</h1>
        <p>Para poder crear una cuenta, debes introducir los siguientes datos</p>
        <label>
        <p className="textoRegistro">Nombre de usuario:</p>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br/>
        <label>
        <p className="textoRegistro">Correo electrónico:</p>
          <input type="text" value={email} onChange={handleEmailChange} />
        </label>
        <br/>
        <label>
          <p className="textoRegistro">Contraseña nueva:</p>
          <input type="password" value={password} onChange={handlePassword1Change} />
        </label>
        <br/>
        <label>
        <p className="textoRegistro">Repita la contraseña anterior:</p>
          <input type="password" value={password_2} onChange={handlePassword2Change} />
        </label>
        <br/>
        <button type="submit" className="botonRegistro">Registrarse</button>
      </form>
    </div>
  );
}

export default Registrarse;

