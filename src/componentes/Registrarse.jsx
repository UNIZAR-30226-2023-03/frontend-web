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
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [error3, setError3] = useState(false);

  const handleUsernameChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };

  const handlePassword2Change = (event) => {
    if(password!==password_2){
    }
    setPassword2(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username, email, password, password_2);
    if(password!==password_2){
      setError3(true);
      setError1(false);
      setError2(false);
    }
    else{
      await axios.post("https://lamesa-backend.azurewebsites.net/usuario/crear", {email,username, password})
      .then ( response => {
        const cookies = new Cookies();
        cookies.set('idUsuario',response.data.id,{path: '/'})
        cookies.set('nombreUsuario',username,{path: '/'})
        cookies.set('correoUsuario',email,{path: '/'})
        console.log(email)
        navigate(process.env.PUBLIC_URL+'/principal');
      }) 
      .catch(error => {
        console.log(error.response.data)
        if(error.response.data==="Ya existe un usuario con ese username"){
          setError1(true);
          setError2(false);
          setError3(false);
        }
        else if (error.response.data==="Ya existe un usuario con ese email"){
          setError2(true);
          setError3(false);
          setError1(false);
        }
      })
    }
    

  };

  return (
    <div className="containerRegistro">
      <form onSubmit={handleSubmit} className="formRegistro">
        <h1>Crear cuenta</h1>
        <p>Para poder crear una cuenta, debes introducir los siguientes datos</p>
        <label>
        <p className="textoRegistro">Nombre de usuario:</p>
          <input type="text" value={username} required onChange={handleUsernameChange} />
          <p className={error1 ? 'error1' : 'error1In'}>Ya existe un usuario con este nombre</p>
        </label>
        <br/>
        <label>
        <p className="textoRegistro">Correo electrónico:</p>
          <input type="text" value={email} required onChange={handleEmailChange} />
          <p className={error2 ? 'error2' : 'error2In'}>Ya existe un usuario con ese correo</p>
        </label>
        <br/>
        <label>
          <p className="textoRegistro">Contraseña:</p>
          <input type="password" value={password} required onChange={handlePassword1Change} />
        </label>
        <br/>
        <label>
        <p className="textoRegistro">Repita la contraseña:</p>
          <input type="password" value={password_2} required onChange={handlePassword2Change} />
          <p className={error3 ? 'error2' : 'error2In'}>La contraseña no coincide </p>
        </label>
        <br/>
        <button type="submit" className="botonRegistro">Registrarse</button>
      </form>
    </div>
  );
}

export default Registrarse;

