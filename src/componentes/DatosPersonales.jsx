import "../styles/DatosPersonales.css";
import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import ojo from "../imagenes/iconos/ojo.svg";
import home from "../imagenes/iconos/home.svg";





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
  const [cambioUsuario, setCambioUsuario]=useState(false);
  const [cambioCorreo, setCambioCorreo]=useState(false);


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
    }else{setMostrarContraseña(true);setCambioUsuario(false);setCambioCorreo(false);}
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
function nombre(){
  if (cambioUsuario){
    setCambioUsuario(false);
  }
  else{
    setCambioUsuario(true);
    setCambioCorreo(false);
    setMostrarContraseña(false);
  }

}
function fcorreo(){
  if (cambioCorreo){
    setCambioCorreo(false);
  }
  else{
    setCambioCorreo(true);
    setMostrarContraseña(false);
    setCambioUsuario(false);
  }

}



  return(
    
    <div className="todo">
      <div className="back">
        <div class="breadcrumb">
          <div class="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
          <div class="breadcrumb-item">&gt;</div>
          <div class="breadcrumb-item">Datos Personales</div>
        </div>
      </div>
      <h1>Datos personales</h1>
      <div className="separator"></div>
      <p className="nombre">Nombre de usuario :</p>
      <div className="cambio1">
        <p className="usuario" >{username}</p>
        <button className="cambio" onClick={nombre}>CAMBIAR NOMBRE DE USUARIO</button>
      </div>
      <div className="separator"></div>
      <p className="nombre">Correo electronico : </p>
      <div className="cambio1">
        <p className="usuario">{correo}</p>
        <button className="cambio" onClick={fcorreo}>CAMBIAR CORREO ELECTRONICO</button>
      </div>      
      <div className="separator"></div>
      <p className="nombre">Contraseña : </p>
      <div className="cambio1">
        <p className="usuario">XXXXXXX</p>
        <button className="cambio" onClick={mostrasCambio}>CAMBIAR CONTRASEÑA</button>
      </div>    
      <div className="separator"></div>
      <div className="form1">
        {cambioUsuario ? (
            <form onSubmit={handleSubmit}>
              <p className="textoForm">Nuevo nombre de usuario</p>
              <input className="inp" type="text" placeholder="Escriba su nuevo nombre de usuario"
              value={newUser} required onChange={handleOnChange} />
              <p className={ne ? 'si' : 'siIn'}>Su usuario ha sido cambiado a {newUser} </p>
              <button className="chBot" type="submit">CAMBIAR USUARIO</button>
              
          </form>
          ) : (
          <div></div>)}   
          
      </div>
      <div className="form1">
        {cambioCorreo ? (
          <form  onSubmit={handleSubmit1}>
            <p className="textoForm">Nuevo correo electronico</p>
            <input className="inp" type="text" placeholder="Nuevo email" value={newEmail} required onChange={handleOnChange1} />
            <p className={ncr ? 'cr' : 'crIn'}>Su email ha sido cambiado a {newEmail} </p>
            <button className="chBot" type="submit">CAMBIAR CORREO</button>
          </form>
          ) : (
            <div></div>)}
      </div>

      <div className="form1">
        {mostrarContraseña ?(
          <div className="container">
              <p className="textoForm1">Cambiar la contraseña</p>
              <div className="contraseña">
                <p>Introduce la contraseña antigua</p>
                <div className="inpojo">
                  <input className="inp" type={showPass1} placeholder="Contraseña antigua" value={contraseñaAntigua} required onChange={handleOnChange2} />
                  <button className="ojo" onMouseDown={mostrarPass} onMouseUp={mostrarPass}><img src={ojo} alt="" /></button>
                </div>
                <p className={newCtr ? 'antigua' : 'antiguaIn'}>La contraseña antigua es incorrecta </p>
              </div>

              <div className="contraseña">
                <p>Introduce la contraseña nueva</p>
                <div className="inpojo">
                  <input className="inp" type={showPass2} placeholder="Contraseña nueva" value={contraseñaNueva} required onChange={handleOnChange3} />
                  <button className="ojo" onMouseDown={mostrarPass1} onMouseUp={mostrarPass1}><img src={ojo} alt="" /></button>
                </div>
                
              </div>

              <div className="contraseña">
                <p>Repita la contraseña</p>
                <div className="inpojo">
                  <input className="inp" type={showPass3} placeholder="Contraseña nueva" value={contraseñaNueva2} required onChange={handleOnChange4} />
                  <button className="ojo" onMouseDown={mostrarPass2} onMouseUp={mostrarPass2}><img src={ojo} alt="" /></button>
                </div>
                
                <p className={noIgual ? 'noI' : 'noIIn'}>Las contraseñas no coinciden </p>
              </div>
              
              <form onSubmit={handleSubmit2}>
                <button className="chBot1" type="submit">Cambiar Contraseña</button>
                <p className={nueva ? 'nueva' : 'nuevaIn'}>La contraseña ha sido cambiada con exito </p>
                <p className={mal ? 'mail' : 'mailIn'}>Error, la contraseña no ha sido cambiada </p>
              </form>
          </div>
          ) : (
        <div></div>)}
      
      </div>

    </div>
    
  );
}

export default DatosPersonales;