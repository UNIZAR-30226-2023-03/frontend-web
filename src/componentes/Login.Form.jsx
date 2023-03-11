import React, { useState } from 'react';
//import axios from "axios";

function LoginForm() {
  const [login, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(login, password);
    

    fetch('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({login, password}),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // .then (res=> res.jsnon())
    // .catch(error => console.error('Error',error))
    // .then(response => console.log(response))
    // try{
    //   const response = await axios.post("/api/login", {
    //     username: username,
    //     password: password,
    //   });
    // }catch(error){
    //   console.error(error);
    // }
    // Validar la entrada del usuario aquí

    // Enviar datos al servidor aquí
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Usuario:
        <input type="text" value={login} onChange={handleUsernameChange} />
      </label>
      <br />
      <label>
        Contraseña:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <br />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm;