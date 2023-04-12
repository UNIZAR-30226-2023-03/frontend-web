import "../styles/DatosPersonales.css";
import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';





function DatosPersonales(){

  const cookies= new Cookies();
  const id=cookies.get('idUsuario');
  const correo=cookies.get('correoUsuario');
  const username=cookies.get('nombreUsuario');
  const [newUser, setUser]=useState('');
  const [ne, setNewUser]=useState(false);
  const [newEmail, setnewEmail]=useState('');
  const [ncr, setncr]=useState(false);
  
  const [contraseñaAntigua, setcontraseñaAntigua]=useState('');
  const [newCtr, setNewCtr]=useState(false);
  const [contraseñaNueva, setcontraseñaNueva]=useState('');
  const [nueva, setNueva]=useState(false);
  const [contraseñaNueva2, setcontraseñaNueva2]=useState('');
  const [mal, setMal]=useState(false);
  const [noIgual, setno]=useState(false);
  const [mostrarContraseña, setMostrarContraseña]=useState(false);
  const [showPass1, setShowPass1]=useState('password');
  const [showPass2, setShowPass2]=useState('password');
  const [showPass3, setShowPass3]=useState('password');


  function handleOnChange(event){
    setUser(event.target.value)
  }
  const handleSubmit = async (event) =>{
    event.preventDefault();
    await axios.post("https://lamesa-backend.azurewebsites.net/usuario/actualizar-username", {id,cambio:newUser})
    .then(response => {
      cookies.set('nombreUsuario',newUser,{path: '/'})
      setNewUser(true);
    })
    .catch(error =>{
      setNewUser(false)
      console.log('no ok')
    })
  }

  function handleOnChange1(event){
    setnewEmail(event.target.value)
  }
  const handleSubmit1 = async (event) =>{
    event.preventDefault();
    await axios.post("https://lamesa-backend.azurewebsites.net/usuario/actualizar-email", {id,cambio:newEmail})
    .then(response => {
      cookies.set('correoUsuario',newEmail,{path: '/'})
      setncr(true);
    })
    .catch(error =>{
      setncr(false);
      console.log(error.response.data)
    })
  }
  
  function handleOnChange2(event){
    setcontraseñaAntigua(event.target.value)
  }
  function handleOnChange3(event){
    setcontraseñaNueva(event.target.value)
  }
  function handleOnChange4(event){
    setcontraseñaNueva2(event.target.value)
  }

  const handleSubmit2 = async (event) =>{
    event.preventDefault();
    await axios.post("https://lamesa-backend.azurewebsites.net/usuario/login", {login:correo,password:contraseñaAntigua})
    .then(response => {
      //contraseña correcta enviar la otra 
      if(contraseñaNueva===contraseñaNueva2){
        axios.post("https://lamesa-backend.azurewebsites.net/usuario/actualizar-password", {id,cambio:contraseñaNueva})
        .then(response1=>{
          //cambio de contraseña realizado
          setNueva(true);
          setMal(false)
          setno(false);
          setNewCtr(false)
        })
        .catch(error1 =>{
          //contraseña no correcta
          setMal(true);
          setNueva(false);
          setno(false);
          setNewCtr(false)
        })
      }
      else{
        //no coinciden las contraseñas
        setNueva(false);
        setMal(false)
        setno(true);
        setNewCtr(false)
      }
      
    })
    .catch(error =>{
      //contraseña antigua incorrecta
      setNewCtr(true);
      setNueva(false);
      setMal(false)
      setno(false);
    })
  }

 function mostrasCambio(){
    if(mostrarContraseña){
      setMostrarContraseña(false)
    }else{setMostrarContraseña(true);}
  }
function mostrarPass(){ 
    if(showPass1==="text"){
      setShowPass1("password")
    }else{setShowPass1("text")}
}
function mostrarPass1(){ 
  if(showPass2==="text"){
    setShowPass2("password")
  }else{setShowPass2("text")}
}
function mostrarPass2(){ 
  if(showPass3==="text"){
    setShowPass3("password")
  }else{setShowPass3("text")}
}



  return(
    
    <>
    <h1>Datos personales</h1>
    <p>Nombre de usuario : {username} </p>
    <form onSubmit={handleSubmit}>
      <p>Si quieres cambiar tu nombre de usuario introducelo en el siguente recuadro</p>
      <input type="text" placeholder="Nuevo nombre de usuario"
      value={newUser} required onChange={handleOnChange} />
      <p className={ne ? 'si' : 'siIn'}>Su usuario ha sido cambiado a {newUser} </p>
      <button type="submit">Cambiar Usuario</button>
    </form>
    <p>Correo electronico : {correo} </p>
    <form onSubmit={handleSubmit1}>
      <p>Si quieres cambiar tu email introducelo en el siguente recuadro</p>
      <input type="text" placeholder="Nuevo email"
      value={newEmail} required onChange={handleOnChange1} />
      <p className={ncr ? 'cr' : 'crIn'}>Su email ha sido cambiado a {newEmail} </p>
      <button type="submit">Cambiar Correo</button>
    </form>
    <button onClick={mostrasCambio}>Cambiar contraseña</button>
    {mostrarContraseña ?(
      <div className="container">
        <p>Cambiar contraseña</p>
        
          <p>Introduce la contraseña antigua</p>
          <input type={showPass1} placeholder="Contraseña antigua"
          value={contraseñaAntigua} required onChange={handleOnChange2} />
          <button onMouseDown={mostrarPass} onMouseUp={mostrarPass}>mostrar Contraseña</button>
          <p className={newCtr ? 'antigua' : 'antiguaIn'}>La contraseña antigua es incorrecta </p>
          <p>Introduce la contraseña nueva</p>
          <input type={showPass2} placeholder="Contraseña nueva"
          value={contraseñaNueva} required onChange={handleOnChange3} />
          <button onMouseDown={mostrarPass1} onMouseUp={mostrarPass1}>mostrar Contraseña</button>
          <p>Repita la contraseña</p>
          <input type={showPass3} placeholder="Contraseña nueva"
          value={contraseñaNueva2} required onChange={handleOnChange4} />
          <button onMouseDown={mostrarPass2} onMouseUp={mostrarPass2}>mostrar Contraseña</button>
          <p className={noIgual ? 'noI' : 'noIIn'}>Las contraseñas no coinciden </p>
          <form onSubmit={handleSubmit2}>
            <button type="submit">Cambiar Contraseña</button>
            <p className={nueva ? 'nueva' : 'nuevaIn'}>La contraseña ha sido cambiada con exito </p>
            <p className={mal ? 'mail' : 'mailIn'}>Error, la contraseña no ha sido cambiada </p>
          </form>
      </div>
      ) : (
      <div></div>)}
    
    </>
  );
}

export default DatosPersonales;