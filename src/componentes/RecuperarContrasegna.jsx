import React, { useState, useEffect} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom'
import "../styles/Registrarse.css";
import Cookies from 'universal-cookie';


function RecuperarContrasegna() {
  const cookies= new Cookies();
  const [erroremail, seterroremail] = useState("");
  const [password1, setpassword1] = useState('');
  const [password2, setpassword2] = useState('');
  const emailusuario = cookies.get('correoUsuario');
  const [mostrarconfirmacion, setmostrarconfirmacion] = useState(false);
  const [token, setToken] = useState(null);


  useEffect(() => {
    function getTokenFromUrl() {
      const urlSearchParams = new URLSearchParams(window.location.search);
      return urlSearchParams.get('token');
    }
    setToken(getTokenFromUrl());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(password1 !== password2){
      seterroremail("Las contraseñas no coinciden")
    }
    else{
      console.log("ENVIANDO email: "+emailusuario);
      console.log("ENVIANDO token: "+token);
      console.log("ENVIANDO password: "+password1);
      await axios.post("https://lamesa-backend.azurewebsites.net/usuario/validar-codigo", {email:emailusuario, token: token,password: password1}) 
      .then ( response => {
        setmostrarconfirmacion(true);
      }) 
      .catch(error => {
        console.log("ERROR");
        seterroremail(error.response.data);
      })  
    }
  };

  return (
    <div className="containerRegistro">
      <form onSubmit={handleSubmit} className="formRegistro">
        <h1>Recuperar contraseña</h1>
        {mostrarconfirmacion ? (
          <>
        <p className="confirmacion">Constraseña cambiada correctamente</p>
        <p></p>
        <Link to='/' className="volverInicioSesion">Volver a de inicio de sesión</Link>
          </>
        ) : (
        <>
        <label>
        <p className="textoRegistro">Introduce tu <br></br> nueva contraseña:</p>
          <input type="password" value={password1} required onChange={(e) => setpassword1(e.target.value)} />
        </label>
        <label>
        <p className="textoRegistro">Repita la <br></br> contraseña anterior:</p>
          <input type="password" value={password2} required onChange={(e) => setpassword2(e.target.value)} />
        </label>
        <br/> <br/> <br/>
        <button type="submit" className="botonRegistro">Guardar contraseña</button>
        <p className="mensajeError">{erroremail}</p>
        </>
        )}
      </form>
    </div>
  );
}

export default RecuperarContrasegna;
