import React, { useState } from 'react';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validar la entrada del usuario aquí

    // Enviar datos al servidor aquí
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Usuario:
        <input type="text" value={username} onChange={handleUsernameChange} />
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