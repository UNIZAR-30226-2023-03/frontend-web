import React, { useState, useEffect, useMemo, useRef} from "react";
import "../styles/Partida.css";
import Timer from './Timer';
import {casillas} from './Casillas.jsx'
import { useLocation } from 'react-router-dom';
//import io from 'socket.io-client';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Cookies from 'universal-cookie';
import axios from 'axios';
import uno from "../imagenes/carasdado/uno.PNG";
import dos from "../imagenes/carasdado/dos.PNG";
import tres from "../imagenes/carasdado/tres.PNG";
import cuatro from "../imagenes/carasdado/cuatro.PNG";
import cinco from "../imagenes/carasdado/cinco.PNG";
import seis from "../imagenes/carasdado/seis.PNG";

//enviar un 20 cuando matas

const photos = [
  { id:1, name: "Foto 1", url: uno },
  { id:2, name: "Foto 2", url: dos },
  { id:3, name: "Foto 3", url: tres },
  { id:4, name: "Foto 4", url: cuatro },
  { id:5, name: "Foto 5", url: cinco },
  { id:6, name: "Foto 6", url: seis },
];
let estadoFichas = [
  {ficha:'ficha1AZUL',casilla:'inicio-AZUL-1'},
  {ficha:'ficha2AZUL',casilla:'inicio-AZUL-2'},
  {ficha:'ficha3AZUL',casilla:'inicio-AZUL-3'},
  {ficha:'ficha4AZUL',casilla:'inicio-AZUL-4'},
  {ficha:'ficha1AMARILLO',casilla:'inicio-AMARILLO-1'},
  {ficha:'ficha2AMARILLO',casilla:'inicio-AMARILLO-2'},
  {ficha:'ficha3AMARILLO',casilla:'inicio-AMARILLO-3'},
  {ficha:'ficha4AMARILLO',casilla:'inicio-AMARILLO-4'},
  {ficha:'ficha1ROJO',casilla:'inicio-ROJO-1'},
  {ficha:'ficha2ROJO',casilla:'inicio-ROJO-2'},
  {ficha:'ficha3ROJO',casilla:'inicio-ROJO-3'},
  {ficha:'ficha4ROJO',casilla:'inicio-ROJO-4'},
  {ficha:'ficha1VERDE',casilla:'inicio-VERDE-1'},
  {ficha:'ficha2VERDE',casilla:'inicio-VERDE-2'},
  {ficha:'ficha3VERDE',casilla:'inicio-VERDE-3'},
  {ficha:'ficha4VERDE',casilla:'inicio-VERDE-4'},
];
let fichasdisponibles = [];
const vectorAmarillo = [5,6,6,5,6,6,5,6,6,5,6,6,5,6,6,5,6,6];
const vectorAzul = [5,6,6,5,5,6,6,5,1,1,1,1,1,1,1,2,2,2,2,2];


function actualizarFicha(ficha,nuevaCasilla){
  estadoFichas = estadoFichas.map((elem) =>
  elem.ficha === ficha ? {...elem,casilla:nuevaCasilla}: elem);
}
function buscarCasilla(ficha) {
  const casilla = estadoFichas.find(elem => elem.ficha === ficha)?.casilla;
  return casilla;
}
async function enviarDado(numdado,setturno,idPartida,setnumDado,color,indice,setindice,setpartidafinalizada,juegoautonomo,setmostrartimer) {
  let vector;
  if(color === "AMARILLO"){
    vector = vectorAmarillo;
  }
  else{
    vector = vectorAzul;
  }
  let response;
  console.log("ENVIANDO DADO: "+vector[indice]);
  setnumDado(vector[indice]);
  //console.log("DADO: "+numdado);
  //response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/dado/"+idPartida + "?dado="+numdado);
  response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/dado/"+idPartida + "?dado="+vector[indice]);
  console.log("RESPUESTA TRAS ENVIAR DADO SACAR: "+response.data.sacar);
  setmostrartimer(false);
  if(response.data.sacar===true){
    moverFicha(response.data.fichas[0].numero,parseInt(response.data.casilla.posicion)+1,color,response.data.casilla.tipo);
    setturno(response.data.turno);
  }
  else if(response.data.vueltaACasa){
    moverFicha(response.data.fichas[0].numero,parseInt(response.data.casilla.posicion)+1,color,"CASA");
    setturno(response.data.turno);
  }
  else{
    console.log("BLOQUEANDO FICHASS");
    let numficha = mostrarFichasBloqueadas(response.data.fichas,color,juegoautonomo);
    if(numficha !== -1 && juegoautonomo){
      colorearFichas(color);
      console.log("ENVIO FICHA AUTOMATICAMENTE "+numficha);
      enviarFicha(numficha,idPartida,vector[indice],setturno,color,setpartidafinalizada,setmostrartimer);
    }
  }
  setindice(indice+1);
}

async function enviarFicha(numficha,idPartida,numDado,setturno,color,setpartidafinalizada, setmostrartimer){
  //const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/movimiento", {partida: idPartida,ficha: numficha,dado: numDado});
  const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/movimiento", {partida: idPartida,ficha: numficha,dado: numDado});
  if(!response.data.acabada){
    moverFicha(numficha,parseInt(response.data.destino.posicion)+1,color,response.data.destino.tipo);
    if(response.data.comida){
      console.log("FICHA COMIDA NUMERO "+response.data.comida.numero);
      console.log("FICHA COMIDA CASILLA "+parseInt(response.data.destino.posicion)+1);
      moverFicha(response.data.comida.numero,parseInt(response.data.destino.posicion)+1,response.data.comida.color,"CASA");
    }
    setturno(response.data.turno);
    if(response.data.turno === color){
      const botonStart = document.querySelector('.tirarDado');
      botonStart.style.display = 'block';
      setmostrartimer(true);
      // ha tirado un 6, activar de nuevo el timer
    }
  }
  else{
    setpartidafinalizada(true);
  }
}

function moverFicha(numficha, numcasilla,colorficha,tipocasilla){
  console.log("AL PRINCIPIO");
  console.log(estadoFichas);
  let ficha,fichacss, fichamover, casilla, casilla_ant,casilla_anterior;
  const casillasArray = Object.values(casillas);
  if(tipocasilla ==="CASA"){
    numcasilla = 'inicio-'+colorficha+'-'+numficha;
    casilla = casillasArray.find(c => c.id === numcasilla);
  }
  else if(tipocasilla ==="PASILLO"){
    numcasilla = numficha+'-'+colorficha;
    casilla = casillasArray.find(c => c.id === numcasilla);
  }
  else if(tipocasilla ==="META"){
    numcasilla ='llegada-'+colorficha+'-'+numficha;
    casilla = casillasArray.find(c => c.id === numcasilla);
  }
  else{
    casilla = casillasArray.find(c => c.id === numcasilla);
    if(casilla.numfichas===0){
      console.log("NUMCASILLA SIN FICHAS "+numcasilla);
      casilla.numfichas = 1;
    }
    else{    
      casilla = casillas.find(c => c.id === casilla.id+'-2');
      numcasilla = numcasilla+'-2';
      console.log("NUMCASILLA CON FICHAS "+numcasilla);
    }
  }
  ficha = 'ficha'+numficha+colorficha;
  fichacss = '.'+ficha;
  console.log("FICHA QUE SE VA A MOVER "+fichacss);
  casilla_ant = buscarCasilla(ficha);
  console.log("CASILLA ANTERIOR DE LA FICHA "+casilla_ant);
  casilla_anterior = casillas.find(c => c.id === casilla_ant);
  casilla_anterior.numfichas = 0;
  fichamover = document.querySelector(fichacss);
  fichamover.style.left = casilla.left;
  fichamover.style.top = casilla.top;
  actualizarFicha(ficha,numcasilla);
  console.log("FICHA "+ fichacss+" MOVIDA A LA CASILLA "+ numcasilla);
  console.log("AL FINAL ");
  console.log(estadoFichas);
}

function mostrarFichasBloqueadas(fichas,color,juegoautonomo){
  let ficha,fichacambiar,i;
  let fichasBloqueadas = fichas.map((ficha) => ficha.numero);
  for (i = 1; i <= 4; i++) {
    ficha = '.ficha'+i+color;
    fichacambiar = document.querySelector(ficha);
    if (fichasBloqueadas.includes(i)) {
      console.log("FICHA GRIS: "+ficha);
      fichacambiar.style.backgroundColor = "rgb(39, 40, 41)"; // establece el color de fondo
    } else {
      console.log("HABILITANDO FICHA: "+ ficha);
      if(!juegoautonomo){
        fichacambiar.disabled = false;
        console.log("AÑADIENDO FICHA AL VECTOR");
        fichasdisponibles = [...fichasdisponibles, i];
        console.log("FICHA AÑADIDA "+fichasdisponibles[0]);
      }
      else{
        console.log("EN FICHAS BLOQUEADAS, JUEGO AUTOMATICO, DEVUELVO: "+i);
        return i;
      }
    }
  }
  console.log("EN FICHAS BLOQUEADAS, NO JUEGO AUTOMATICO, DEVUELVO: "+-1);
  return -1;
}

function colorearFichas(color){
  let ficha,fichacambiar,i,colorficha;
  if(color ==="AZUL"){
    colorficha = "rgb(8, 152, 249)";
  }
  else if(color ==="AMARILLO"){
    colorficha= "rgb(255, 196, 2)";
  }
  else if(color === "VERDE"){
    colorficha = "rgb(126, 223, 15)";
  }
  else{
    colorficha = "rgb(93, 0, 0)";
  }
  for (i = 1; i <= 4; i++) {
    ficha = '.ficha'+i+color;
    fichacambiar = document.querySelector(ficha);
    fichacambiar.style.backgroundColor = colorficha;
    fichacambiar.disabled = true;
  }
}
function bloquearFichas(numjugadores,color){
  let i,ficha,fichacambiar;
 
  for (i = 1; i <= 4; i++) {
    ficha = '.ficha'+i+'AMARILLO';
    fichacambiar = document.querySelector(ficha);
    fichacambiar.disabled = true;
  }
  
  if (numjugadores > 1 || color !== "AMARILLO"){
    for (i = 1; i <= 4; i++) {
      ficha = '.ficha'+i+'AZUL';
      fichacambiar = document.querySelector(ficha);
      fichacambiar.disabled = true;
    }
  }
  if(numjugadores >= 3 || (color === "ROJO" || color ==="VERDE")){
    for (i = 1; i <= 4; i++) {
      ficha = '.ficha'+i+'ROJO';
      fichacambiar = document.querySelector(ficha);
      fichacambiar.disabled = true;
    }
  }
  if(numjugadores === 4 || color ==="VERDE"){
    for (i = 1; i <= 4; i++) {
      ficha = '.ficha'+i+'VERDE';
      fichacambiar = document.querySelector(ficha);
      fichacambiar.disabled = true;
    }
  }  
}

function Partida() {
  //const casillasTablero = casillas;
  const cookies = useMemo(() => new Cookies(), []);
  const { state } = useLocation();
  const [idPartida, setIdPartida] = useState(null);
  const [color, setColor] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [usernameAmarillo, setUsernameAmarillo] = useState(null);
  const [usernameAzul, setUsernameAzul] = useState(null);
  const [usernameRojo, setUsernameRojo] = useState(null);
  const [usernameVerde, setUsernameVerde] = useState(null);
  const [numjugadores,setNumjugadores]  = useState(0);
  const [turno, setturno] = useState('');
  const [numDado, setnumDado] = useState(0);
  const [primeravez, setprimeravez] = useState(true);
  const [partidaempezada, setpartidaempezada] = useState(false);
  const [partidafinalizada, setpartidafinalizada] = useState(false);
  const [juegoautomatico, setjuegoautomatico] = useState(false);
  const [fichapulsada, setfichapulsada] = useState(false);
  const [botondadopulsado, setbotondadopulsado] = useState(false);
  const [indice, setindice] = useState(0);
  const [mostrartimer, setmostrartimer] = useState(false);
  const dadoRef = useRef(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompcl, setstompcl] = useState(null);
  const [showChat, setShowChat] = useState(false);

 

  useEffect(() => {
    function connectToSocket() {
      let numjug = 0;
      const url = "https://lamesa-backend.azurewebsites.net"
      console.log("connecting to the game");
      let socket = new SockJS(url + "/ws");
      let stompClient = Stomp.over(socket);
      setstompcl(stompClient);
      stompClient.connect({}, function (frame) {
          stompClient.subscribe("/topic/nuevo-jugador/" + idPartida, function (response) {
              // Un jugador se ha unido a la partida (cuando aún no ha empezado)
              let data = JSON.parse(response.body);
              if(data.color !== color){
                if(data.color ==="ROJO"){
                  setUsernameRojo(data.username);
                  setNumjugadores(3);
                  numjug = 3;
                }
                else if(data.color ==="AZUL"){
                  setUsernameAzul(data.username);
                  setNumjugadores(2);
                  numjug = 2;
                }
                else if(data.color ==="VERDE"){
                  setUsernameVerde(data.username);
                  setNumjugadores(4);
                  numjug = 4;
                }
              }
          })
          stompClient.subscribe("/topic/dado/" + idPartida, function (response) {
            // Un jugador ha sacado ficha de casa -> Actualizar tablero
            let data = JSON.parse(response.body);
            if(color !== data.fichas[0].color && data.sacar){
              console.log("ACTUALIZAR TABLERO POR EL MOVIMIENTO DE OTRO JUGADOR");
              moverFicha(data.fichas[0].numero, parseInt(data.casilla.posicion)+1,data.fichas[0].color,data.casilla.tipo);
            }
            console.log("RESPUESTA DE DADO CASA: "+data.vueltaACasa);

            if(data.vueltaACasa){
              moverFicha(data.fichas[0].numero,parseInt(data.casilla.posicion)+1,data.fichas[0].color,"CASA");
            }
            setpartidaempezada(true);
            bloquearFichas(numjug,color);
            console.log("LLEGA TURNO DESDE DADO: "+ data.turno);
            console.log("LLEGA TURNO DESDE DADO SACAR: "+ data.sacar);
            console.log("LLEGA TURNO DESDE DADO COLOR FICHA: "+ data.fichas[0].color);
            setturno(data.turno);
            setjuegoautomatico(false);
            setfichapulsada(false);
            setbotondadopulsado(false);
            //displayResponse(data);
        })
          stompClient.subscribe("/topic/movimiento/" + idPartida, function (response) {
              // Un jugador ha hecho un movimiento -> Actualizar tablero
              let data = JSON.parse(response.body);
              //displayResponse(data);
              if(!data.acabada){
                if(color !== data.ficha.color){
                  console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO NUMCASILLA: "+data.destino.posicion+1);
                  console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO COLOR: "+data.ficha.color);
                  console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO FICHA: "+data.ficha.numero);
                  moverFicha(data.ficha.numero, parseInt(data.destino.posicion)+1,data.ficha.color,data.destino.tipo);  
                }
                if(data.comida){
                  moverFicha(data.comida.numero,parseInt(data.destino.posicion)+1,data.comida.color,"CASA");
                  //enviarDado(20,setturno,idPartida,setnumDado,color,indice,setindice,setpartidafinalizada,juegoautomatico,setmostrartimer);
                }
                setjuegoautomatico(false);
                setfichapulsada(false);
                setbotondadopulsado(false);
                setturno(data.turno);                             
              }
              else{
                setpartidafinalizada(true);
              }
          })
          stompClient.subscribe("/topic/turno/" + idPartida, function (response) {
              // Mensaje de turno recibido
              let data = JSON.parse(response.body);
              console.log("LLEGA TURNO DESDE TURNO: "+ data);
              setturno(data);
              setjuegoautomatico(false);
              setfichapulsada(false);
              setbotondadopulsado(false);
              setpartidaempezada(true);
              if(data !== color){
                colorearFichas(color);
                bloquearFichas(numjug,color);
              }
              console.log("LLAMANDO A BLOQUEAR FICHAS CON "+color+" "+numjug);
          })
          stompClient.subscribe("/topic/chat/" + idPartida, function (response) {
            // Mensaje de chat recibido
            let data = JSON.parse(response.body);
            console.log("ALGUIEN HA ESCRITO ALGO");
            console.log("usuario: "+data.usuario);
            console.log("mensaje: "+data.mensaje);
            if(data.usuario !== cookies.get('nombreusuario')){
              const mensaje = {
                body: data.mensaje,
                from: data.usuario
              }
              //setMessages(()=>mensaje)
              setMessages((prevMessages) => [...prevMessages, mensaje]);
            }
            
        })
      })
    }
    connectToSocket();
    // eslint-disable-next-line
  }, [color, idPartida]);

  useEffect(() => {
    let col = "";
    if (primeravez && state) {
      setprimeravez(false);
      setIdPartida(state.id_part);
      setColor(state.col);
      col = state.col;
      const jugadores = state.jug;
      function comprobarUsernames(){
        if(col==="AMARILLO"){
          setUsernameAmarillo(cookies.get('nombreUsuario'));
          setNumjugadores(1);
        }
        else if(col === "AZUL"){
          setUsernameAmarillo(jugadores && jugadores[0].username);
          setUsernameAzul(cookies.get('nombreUsuario'));
          setNumjugadores(2);
        }else if(col ==="ROJO"){
          setUsernameAmarillo(jugadores && jugadores[0].username);
          setUsernameAzul(jugadores && jugadores[1].username);
          setUsernameRojo(cookies.get('nombreUsuario'));
          setNumjugadores(3);
        }else if(col ==="VERDE"){
          setpartidaempezada(true);
          setUsernameAmarillo(jugadores && jugadores[0].username);
          setUsernameAzul(jugadores && jugadores[1].username);
          setUsernameRojo(jugadores && jugadores[2].username);
          setUsernameVerde(cookies.get('nombreUsuario'));
          setNumjugadores(4);
        }
      }
      comprobarUsernames();
    }
  }, [cookies,primeravez,state]);
 
  useEffect(() => {
    let intervalId = null, dado = 0;
    if(isPlaying){
      intervalId = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => {
          let newIndex = prevIndex;
          while (newIndex === prevIndex) {
            newIndex = Math.floor(Math.random() * photos.length);
          }
          return newIndex;
        });
      }, 190);
      dado = currentPhotoIndex +1;
      dadoRef.current = dado;
    }
    return () => {
      clearInterval(intervalId);
    };
  },[isPlaying, currentPhotoIndex]);

  const handleStart = async() => {
    bloquearFichas(numjugadores,color);
    setIsPlaying(true);
    await new Promise(resolve => setTimeout(resolve, getRandomTime()));
    setIsPlaying(false);
    return Promise.resolve();
  };

  // tiempo aleatorio entre 2 y 4 segundos
  const getRandomTime = () => {
    return Math.floor(Math.random() * 2000) + 2000;
  };
  
  async function enviarComienzopartida(){
    const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/empezar/"+idPartida);
    setturno(response.data);
  }
  function startpartida(){
    setpartidaempezada(true);
    bloquearFichas(numjugadores,color);
    enviarComienzopartida();
    const botonStart = document.querySelector('.empezarPartida');
    botonStart.style.display = 'none';
  }
  async function gestionarenviodado(juegoautonomo){
    await handleStart();
    console.log("enviando y actualizando DADO: "+dadoRef.current);
    enviarDado(dadoRef.current,setturno,idPartida,setnumDado,color,indice,setindice,setpartidafinalizada,juegoautonomo,setmostrartimer); 
  }
  const onClick = () => {
    const botonTirarDado = document.querySelector('.tirarDado');
    botonTirarDado.style.display = 'none';
    setbotondadopulsado(true);
    setjuegoautomatico(false);
    console.log("boton tirar dado pulsado");
    gestionarenviodado(false);
  };

  function handleTimeUp() {
    console.log("ENTRANDO EN HANDLETIMEUP");
    console.log("turno: "+turno);
    console.log("color: "+color);
    if(turno === color){
      if(!botondadopulsado){
        console.log("JUGADOR NO HA TIRADO EL DADO");
        setbotondadopulsado(true);
        setjuegoautomatico(true);
        const botonTirarDado = document.querySelector('.tirarDado');
        botonTirarDado.style.display = 'none';
        gestionarenviodado(true);
      }
      else if(!fichapulsada){
        console.log("NO SE HA PULSADO LA FICHA, JUEGO AUTOMATICO");
        setfichapulsada(true);
        setjuegoautomatico(true);
        if(fichasdisponibles.length !== 0) {
          let numficha = fichasdisponibles[0];
          console.log("FICHA A ENVIAR DESDE TIMEUP "+numficha);
          console.log("DADO A ENVIAR DESDE TIMEUP "+numDado);
          colorearFichas(color);
          enviarFicha(numficha,idPartida,numDado,setturno,color,setpartidafinalizada,setmostrartimer);
        }
      }
    }
  }

  const fichaPulsada = (numficha, color) => {
    setfichapulsada(true);
    setjuegoautomatico(false);
    console.log("FICHA PULSADA");
    let ficha = '.ficha'+numficha+color;
    console.log("INHABILITANDO FICHA: "+ ficha);
    let fichacambiar = document.querySelector(ficha);
    fichacambiar.disabled = true;
    bloquearFichas(numjugadores,color);
    colorearFichas(color);
    fichasdisponibles = [];
    enviarFicha(numficha,idPartida,numDado,setturno,color,setpartidafinalizada,setmostrartimer);
  };
  async function enviarmensaje(message){
    console.log("ENVIANDO MENSAJE: "+message);
    stompcl.send("/app/chat/" + idPartida, {}, JSON.stringify({
      usuario: cookies.get('nombreUsuario'),
      mensaje: message
    }));
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    enviarmensaje(message);
    const mensaje ={
      body: message,
      from: "Yo"
    }
    setMessages([...messages,mensaje]);
    setMessage("");
    console.log("MENSAJES: "+ messages);
  }


  return (  
    <>
      <p>El id es {idPartida}</p>
      <p>El color es {color}</p>
      <p>Turno de {turno}</p>
      {partidafinalizada && <p>LA PARTIDA SE ACABÓ!!!!</p>}
      {color === turno && juegoautomatico && <p>JUGANDO AUTOMÁTICAMENTE DURANTE 1 TURNO</p>}
     <div>
        {color === "AMARILLO" && 
        <button className="empezarPartida" onClick={startpartida}>
        Comenzar Partida
        </button>
        }
        <button className="abrirChat"onClick={() => setShowChat(!showChat)}>
          CHAT
        </button>
        {showChat &&
        <div className="chat">
            <ul>
            {messages.map((message,index) => (
              <li key={index}>
                <p style={{textAlign: message.from === "Yo" ? 'right' : 'left'}}>
                  {message.from}: 
                </p>
                <p style={{textAlign: message.from === "Yo" ? 'right' : 'left'}}>
                  {message.body}
                </p>
              </li>
            ))} 
            </ul>
          <form onSubmit={handleSubmit}>
            <input type="text" onChange={(e) => setMessage(e.target.value)}
            value={message} placeholder="Escribir mensaje..."/>
            <button>Enviar</button>
          </form>
        </div>}
        
        <h1 className="usernameVerde" >{usernameVerde}</h1>
        <h1 className="usernameAmarillo">{usernameAmarillo}</h1> 
        <h1 className="usernameRojo">{usernameRojo}</h1>
        <h1 className="usernameAzul">{usernameAzul}</h1>
      </div>    
      <div className="lamesa">
        <div className="icono"></div>
        {usernameAzul && (
          <>
          <button className="ficha1AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "AZUL") : null}></button>
          <button className="ficha2AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 2, "AZUL") : null}></button>
          <button className="ficha3AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 3, "AZUL") : null}></button>
          <button className="ficha4AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 4, "AZUL") : null}></button>
          </>
        )}
        {usernameRojo && (
          <>
          <button className="ficha1ROJO" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "ROJO") : null}></button>
          <button className="ficha2ROJO" onClick={fichaPulsada.bind(null, 2, "ROJO")}></button>
          <button className="ficha3ROJO" onClick={fichaPulsada.bind(null, 3, "ROJO")}></button>
          <button className="ficha4ROJO" onClick={fichaPulsada.bind(null, 4, "ROJO")}></button>
          </>
        )}
        {usernameAmarillo && (
          <>
          <button className="ficha1AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 1, "AMARILLO") : null}></button>
          <button className="ficha2AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 2, "AMARILLO") : null}></button>
          <button className="ficha3AMARILLO" onClick={partidaempezada ? fichaPulsada.bind(null, 3, "AMARILLO") : null}></button>
          <button className="ficha4AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 4, "AMARILLO") : null}></button>
          </>
        )}

        {usernameVerde && (
          <>
          <button className="ficha1VERDE" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "VERDE") : null}></button>
          <button className="ficha2VERDE" onClick={fichaPulsada.bind(null, 2, "VERDE")}></button>
          <button className="ficha3VERDE" onClick={fichaPulsada.bind(null, 3, "VERDE")}></button>
          <button className="ficha4VERDE" onClick={fichaPulsada.bind(null, 4, "VERDE")}></button>
          </>
        )}
        <div className="azul"></div>
        <div className="rojo"></div>
        <div className="amarillo"></div>
        <div className="verde"></div>
        <div className="azulb"></div>
        <div className="rojob"></div>
        <div className="amarillob"></div>
        <div className="verdeb"></div>
        <div className="azulc"></div>
        <div className="rojoc"></div>
        <div className="amarilloc"></div>
        <div className="verdec"></div>
        <div className="azuld"></div>
        <div className="rojod"></div>
        <div className="amarillod"></div>
        <div className="verded"></div>

        <div className="verdee">         
          <div className="filas"></div>
          <div className="filas f1"></div>
          <div className="filas f2"></div>
          <div className="filas f3"></div>
          <div className="filas f4"></div>
          <div className="filas f5"></div>
          <div className="filas f6"></div>
          <div className="filas f7"></div>
          <div className="filab f8"></div>
          <div className="filab f9"></div>
          <div className="filab f10"></div>
          <div className="filab f11"></div>
          <div className="filab f12"></div>
          <div className="filab f13"></div>
          <div className="filab f14"></div>
          <div className="filab f15"></div>
          <div className="filac f16"></div>
          <div className="filac f17"></div>
          <div className="filac f18"></div>
          <div className="filac f19"></div>
          <div className="filac f20"></div>
          <div className="filac f21"></div>
          <div className="filac f22"></div>
          <div className="filac f23"></div>
          <div className="filad f24"></div>
          <div className="filad f25"></div>
          <div className="filad f26"></div>
          <div className="filad f27"></div>
          <div className="filad f28"></div>
          <div className="filad f29"></div>
          <div className="filad f30"></div>
          <div className="filad f31"></div> 
          <div className="filae incli1"></div>
          <div className="filae incli2"></div>
          <div className="filae incli3"></div>
          <div className="filae incli4"></div>   
          <div className="filae derpasamarillo"></div>  
          <div className="filae izqpasamarillo"></div>
          <div className="filae derpasrojo"></div>  
          <div className="filae izqpasrojo"></div>
          <div className="filae debpasazul"></div>  
          <div className="filae arrpasazul"></div>     
          <div className="filae debpasverde"></div>  
          <div className="filae arrpasverde"></div>    
          <i className="star s1 fa fa-star"></i>
          <i className="star s2 fa fa-star"></i>   
          <div className="s3">
          <i className="ss3 fa fa-star"></i></div>      
          <div className="s4">
          <i className="ss4 fa fa-star"></i></div>         
          <div className="s5">
          <i className="ss5 fa fa-star"></i></div>           
          <i className="star s6 fa fa-star"></i>      
          <i className="star s7 fa fa-star"></i>
          <i className="star s8 fa fa-star"></i>
          <div className="s9">
          <i className="ss9 fa fa-star"></i></div>    
          <div className="s10">
          <i className="ss10 fa fa-star"></i></div>             
          <div className="s11">
          <i className="ss11 fa fa-star"></i></div>
          <i className="star s12 fa fa-star"></i> 

          <div className="numeros"></div>
          <div className="numeros n1">1</div>
          <div className="numeros n2">2</div>
          <div className="numeros n3">3</div>
          <div className="numeros n4">4</div>
          <div className="numeros n5">5</div>
          <div className="numeros n6">6</div>
          <div className="numeros n7">7</div>
          <div className="numeros n8">8</div>
          <div className="numerosb"></div>
          <div className="numerosb n9">9</div>
          <div className="numerosb n10">10</div>
          <div className="numerosb n11">11</div>
          <div className="numerosb n12">12</div>
          <div className="numerosb n13">13</div>
          <div className="numerosb n14">14</div>
          <div className="numerosb n15">15</div>
          <div className="numerosb n16">16</div>
          <div className="numerosb n17">17</div>
          <div className="numerosb n18">18</div>
          <div className="numerosb n19">19</div>
          <div className="numerosb n20">20</div>
          <div className="numerosb n21">21</div>
          <div className="numerosb n22">22</div>
          <div className="numerosb n23">23</div>
          <div className="numerosb n24">24</div>
          <div className="numerosb n25">25</div>
          
          <div className="numeros n26">26</div>
          <div className="numeros n27">27</div>
          <div className="numeros n28">28</div>
          <div className="numeros n29">29</div>
          <div className="numeros n30">30</div>
          <div className="numeros n31">31</div>
          <div className="numeros n32">32</div>
          <div className="numeros n33">33</div>
          <div className="numeros n34">34</div>
          <div className="numeros n35">35</div>
          <div className="numeros n36">36</div>
          <div className="numeros n37">37</div>
          <div className="numeros n38">38</div>
          <div className="numeros n39">39</div>
          <div className="numeros n40">40</div>
          <div className="numeros n41">41</div>
          <div className="numeros n42">42</div>
          
          <div className="numerosb n43">43</div>
          <div className="numerosb n44">44</div>
          <div className="numerosb n45">45</div>
          <div className="numerosb n46">46</div>
          <div className="numerosb n47">47</div>
          <div className="numerosb n48">48</div>
          <div className="numerosb n49">49</div>
          <div className="numerosb n50">50</div>
          <div className="numerosb n51">51</div>
          <div className="numerosb n52">52</div>
          <div className="numerosb n53">53</div>
          <div className="numerosb n54">54</div>
          <div className="numerosb n55">55</div>
          <div className="numerosb n56">56</div>
          <div className="numerosb n57">57</div>
          <div className="numerosb n58">58</div>
          <div className="numerosb n59">59</div>
          
          <div className="numeros n60">60</div>
          <div className="numeros n61">61</div>
          <div className="numeros n62">62</div>
          <div className="numeros n63">63</div>
          <div className="numeros n64">64</div>
          <div className="numeros n65">65</div>
          <div className="numeros n66">66</div>
          <div className="numeros n67">67</div>
          <div className="numeros n68">68</div>       
        </div>
      </div>
      <div className="partidaDado">
        {photos.map((photo, index) => (
          <img
            key={photo.name}
            src={photo.url}
            alt={photo.name}
            style={{ display: index === currentPhotoIndex ? "block" : "none" }}
          />
        ))
        }
        </div>
      {color === turno && <button className="tirarDado" onClick={onClick}>
        Tirar dado
      </button>}
    <div>
      {!mostrartimer && color === turno && <Timer onTimeUp={handleTimeUp}></Timer>}
      {mostrartimer && <Timer onTimeUp={handleTimeUp}></Timer>}
    </div>
    </>
  );
}
export default Partida;
