import React, { useState, useEffect, useMemo, useRef} from "react";
import "../styles/Partida.css";
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import {casillas} from './Casillas.jsx'
import { useLocation } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
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

import hueso from "../imagenes/iconos/hueso.png";
import calavera from "../imagenes/iconos/calavera.png";
import calabaza from "../imagenes/iconos/calabaza.png";
import calabaza1 from "../imagenes/tablero/calabaza1.png";
import fantasma from "../imagenes/iconos/fantasma.png";
import arbol from "../imagenes/iconos/arbol.png";
import regalo from "../imagenes/iconos/regalo.png";
import nieve from "../imagenes/iconos/nieve.png";
import nie from "../imagenes/iconos/nie.png";


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
let cambioturno = false;
let reconexion = false;

function actualizarFicha(ficha,nuevaCasilla){
  estadoFichas = estadoFichas.map((elem) =>
  elem.ficha === ficha ? {...elem,casilla:nuevaCasilla}: elem);
}
function buscarCasilla(ficha) {
  const casilla = estadoFichas.find(elem => elem.ficha === ficha)?.casilla;
  return casilla;
}

async function enviarDado(numdado,setturno,turno,idPartida,color,setpartidafinalizada,juegoautonomo,setmostrartimer,numFichas,setestadoTurno,setfichaenmeta,setfichacomida){
  let response;
  console.log("DADO: "+numdado);
  response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/dado/"+idPartida + "?dado="+numdado);
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
    let numficha = mostrarFichasBloqueadas(response.data.fichas,color,juegoautonomo,numFichas);
    if(numficha !== -1 && juegoautonomo){
      colorearFichas(color,numFichas);
      console.log("ENVIO FICHA AUTOMATICAMENTE "+numficha);
      enviarFicha(numficha,idPartida,numdado,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautonomo,numFichas,setfichaenmeta,setfichacomida);
    }
    else{
      setestadoTurno("Selecciona una ficha");
    }
    console.log("turno: "+turno);
    console.log("color: "+color);
    if(cambioturno){
      cambioturno = false;
      colorearFichas(color,numFichas);
    }
  }
}

async function enviarFicha(numficha,idPartida,numDado,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautonomo,numFichas,setfichaenmeta,setfichacomida){
  console.log("enviando dado a movimiento: "+numDado);
  console.log("enviando ficha a movimiento: "+numficha);
  console.log("enviando partida a movimiento: "+idPartida);
  const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/movimiento", {partida: idPartida,ficha: numficha,dado: numDado});
  console.log("PARTIDA ACABADA: "+response.data.acabada);
  moverFicha(numficha,parseInt(response.data.destino.posicion)+1,color,response.data.destino.tipo);
  if(response.data.comida){
    console.log("FICHA COMIDA NUMERO "+response.data.comida.numero);
    console.log("FICHA COMIDA CASILLA "+parseInt(response.data.destino.posicion)+1);
    moverFicha(response.data.comida.numero,parseInt(response.data.destino.posicion)+1,response.data.comida.color,"CASA");
  }
  if(!response.data.acabada){
    setturno(response.data.turno);
    if(response.data.turno === color){
      if(response.data.destino.tipo === "META"){
        setfichaenmeta(true);
        console.log("FICHA EN CASA, MANDANDO UN 10");
        enviarDado(10,setturno,turno,idPartida,color,setpartidafinalizada,juegoautonomo,setmostrartimer,numFichas,setestadoTurno,setfichaenmeta,setfichacomida);
      }
      else if(response.data.comida){
        setfichacomida(true);
        console.log("FICHA COMIDA, MANDANDO UN 20")
        enviarDado(20,setturno,turno,idPartida,color,setpartidafinalizada,juegoautonomo,setmostrartimer,numFichas,setestadoTurno,setfichaenmeta,setfichacomida);
      }
      else{
        const botonStart = document.querySelector('.tirarDado');
        botonStart.style.display = 'block';
        setmostrartimer(true);
        setestadoTurno("Tira el dado");
      }
    }
    else{
      colorearFichas(color,numFichas);
    }
  }
  else{
    console.log("partidafinalizada a true");
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
    numcasilla = numcasilla+'-'+colorficha;
    console.log("CASILLA DE PASILLO: "+numcasilla);
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

function mostrarFichasBloqueadas(fichas,color,juegoautonomo,numfichas){
  let ficha,fichacambiar,i,maxfichas;
  if(numfichas === "RAPIDO"){
    maxfichas = 2;
  }
  else{
    maxfichas = 4;
  }
  let fichasBloqueadas = fichas.map((ficha) => ficha.numero);
  for (i = 1; i <= maxfichas; i++) {
    ficha = '.ficha'+i+color;
    fichacambiar = document.querySelector(ficha);
    if (fichasBloqueadas.includes(i)) {
      console.log("FICHA GRIS: "+ficha);
      fichacambiar.style.backgroundColor = "rgb(39, 40, 41)";
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

function colorearFichas(color,numfichas){
  console.log("COLOREANDO FICHAS");
  let ficha,fichacambiar,i,colorficha,maxfichas;
  if(numfichas === "RAPIDO"){
    maxfichas = 2;
  }
  else{
    maxfichas = 4;
  }
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
  for (i = 1; i <= maxfichas; i++) {
    ficha = '.ficha'+i+color;
    fichacambiar = document.querySelector(ficha);
    fichacambiar.style.backgroundColor = colorficha;
    fichacambiar.disabled = true;
  }
}
function bloquearFichas(numjugadores,color,numfichas){
  let i,ficha,fichacambiar,maxfichas;
  if(numfichas === "RAPIDO"){
    maxfichas = 2;
  }
  else{
    maxfichas = 4;
  }
  for (i = 1; i <= maxfichas; i++) {
    ficha = '.ficha'+i+'AMARILLO';
    fichacambiar = document.querySelector(ficha);
    fichacambiar.disabled = true;
  }
  
  if (numjugadores > 1 || color !== "AMARILLO"){
    for (i = 1; i <= maxfichas; i++) {
      ficha = '.ficha'+i+'AZUL';
      fichacambiar = document.querySelector(ficha);
      fichacambiar.disabled = true;
    }
  }
  if(numjugadores >= 3 || (color === "ROJO" || color ==="VERDE")){
    for (i = 1; i <= maxfichas; i++) {
      ficha = '.ficha'+i+'ROJO';
      fichacambiar = document.querySelector(ficha);
      fichacambiar.disabled = true;
    }
  }
  if(numjugadores === 4 || color ==="VERDE"){
    for (i = 1; i <= maxfichas; i++) {
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
  const [color, setColor] = useState("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [usernameAMARILLO, setUsernameAMARILLO] = useState(null);
  const [usernameAZUL, setUsernameAZUL] = useState(null);
  const [usernameROJO, setUsernameROJO] = useState(null);
  const [usernameVERDE, setUsernameVERDE] = useState(null);
  const [numjugadores,setNumjugadores]  = useState(0);
  const [turno, setturno] = useState("");
  const [numDado, setnumDado] = useState(0);
  const [primeravez, setprimeravez] = useState(true);
  const [partidaempezada, setpartidaempezada] = useState(false);
  const [partidafinalizada, setpartidafinalizada] = useState(false);
  const [juegoautomatico, setjuegoautomatico] = useState(false);
  const [fichapulsada, setfichapulsada] = useState(false);
  const [botondadopulsado, setbotondadopulsado] = useState(false);
  const [mostrartimer, setmostrartimer] = useState(false);
  const [fichacomida, setfichacomida] = useState(false);
  const [fichaenmeta, setfichaenmeta] = useState(false);
  const dadoRef = useRef(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompcl, setstompcl] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const miusername  = cookies.get('nombreUsuario');
  const [tipopart, settipopart] = useState("");
  const [erroriniciarpartida, seterroriniciarpartida] = useState("");
  const [numFichas, setnumFichas] = useState("");
  const [showModalAjustes, setShowModalAjustes] = useState(false);
  const [estadoTurno, setestadoTurno] = useState("Tira el dado");
  const idUsuario = cookies.get('idUsuario');
  const navigate = useNavigate();
  const [showModalSeguroSalirPar, setShowModalSeguroSalirPar] = useState(false);
  const [partidaenPausa, setpartidaenPausa] = useState(false);
  const [nombretorneo, setnombretorneo] = useState("");
  const [idtorneo, setidtorneo] = useState("");
  const [mostrarBocadillo, setMostrarBocadillo] = useState(false);
  const[halloween, sethalloween]=useState(false);
  const[navidad, setnavidad]=useState(false);
  const[fichasTablero, setfichasTablero]=useState([]);
  const[soyultimofinalista, setsoyultimofinalista]=useState(false);
  
  useEffect(() => {
    async function asignartablero() {
      await axios.get("https://lamesa-backend.azurewebsites.net/usuario/tablero-activo/"+idUsuario)
      .then ( response => {
        console.log("tablero activo: ",response.data)
        if(response.data.id === 2){
          sethalloween(true);
        }
        else if(response.data.id === 3){
          setnavidad(true);
        }
      })
    }
    asignartablero();
    // eslint-disable-next-line
  }, []);

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
                  setUsernameROJO(data.username);
                  setNumjugadores(3);
                  numjug = 3;
                }
                else if(data.color ==="AZUL"){
                  setUsernameAZUL(data.username);
                  setNumjugadores(2);
                  numjug = 2;
                }
                else if(data.color ==="VERDE"){
                  setUsernameVERDE(data.username);
                  setNumjugadores(4);
                  numjug = 4;
                }
              }
          })
          stompClient.subscribe("/topic/dado/" + idPartida, function (response) {
            // Un jugador ha sacado ficha de casa -> Actualizar tablero
            let data = JSON.parse(response.body);
            if(!partidaempezada){
              setpartidaempezada(true);
            }
            if(color !== data.fichas[0].color && data.sacar){
              console.log("ACTUALIZAR TABLERO POR EL MOVIMIENTO DE OTRO JUGADOR");
              moverFicha(data.fichas[0].numero, parseInt(data.casilla.posicion)+1,data.fichas[0].color,data.casilla.tipo);
            }
            console.log("RESPUESTA DE DADO CASA: "+data.vueltaACasa);

            if(data.vueltaACasa){
              moverFicha(data.fichas[0].numero,parseInt(data.casilla.posicion)+1,data.fichas[0].color,"CASA");
            }
            colorearFichas(color,numFichas);
            bloquearFichas(numjug,color,numFichas);
            console.log("LLEGA TURNO DESDE DADO: "+ data.turno);
            console.log("LLEGA TURNO DESDE DADO SACAR: "+ data.sacar);
            console.log("LLEGA TURNO DESDE DADO COLOR FICHA: "+ data.fichas[0].color);
            setturno(data.turno);
            setjuegoautomatico(false);
            setfichapulsada(false);
            setbotondadopulsado(false);
            if(data.turno === color){
              cambioturno = false;
              if(fichacomida || fichaenmeta){
                setestadoTurno("Selecciona una ficha");
              }
              else{
                setestadoTurno("Tira el dado");
              }  
            }
            else{
              cambioturno = true;
            }  
        })
          stompClient.subscribe("/topic/movimiento/" + idPartida, function (response) {
            // Un jugador ha hecho un movimiento -> Actualizar tablero
            let data = JSON.parse(response.body);
            if(!partidaempezada){
              setpartidaempezada(true);
            }
            console.log("PARTIDA ACABADA: "+data.acabada);        
            if(color !== data.ficha.color){
              console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO NUMCASILLA: "+data.destino.posicion+1);
              console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO COLOR: "+data.ficha.color);
              console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO FICHA: "+data.ficha.numero);
              moverFicha(data.ficha.numero, parseInt(data.destino.posicion)+1,data.ficha.color,data.destino.tipo);  
            }
            if(data.comida){
              moverFicha(data.comida.numero,parseInt(data.destino.posicion)+1,data.comida.color,"CASA");
              // aqui igual no hace falta
              //enviarDado(20,setturno,idPartida,setnumDado,color,indice,setindice,setpartidafinalizada,juegoautomatico,setmostrartimer);
            }
            if(!data.acabada){
              colorearFichas(color,numFichas);
              setjuegoautomatico(false);
              setfichapulsada(false);
              setbotondadopulsado(false);
              setturno(data.turno);
              if(data.turno === color){
                cambioturno = false;
                if(fichacomida || fichaenmeta){
                  setestadoTurno("Selecciona una ficha");
                }
                else{
                  setestadoTurno("Tira el dado");
                }  
              }
              else{
                cambioturno = true;
              }                       
            }
            else{
              console.log("partidafinalizada a true");
              setpartidafinalizada(true);
            }
          })
          stompClient.subscribe("/topic/turno/" + idPartida, function (response) {
              // Mensaje de turno recibido
              let data = JSON.parse(response.body);
              if(!partidaempezada){
                setpartidaempezada(true);
              }
              console.log("LLEGA TURNO DESDE TURNO: "+ data);
              setturno(data);
              setjuegoautomatico(false);
              setfichapulsada(false);
              setbotondadopulsado(false);
              colorearFichas(color,numFichas);
              bloquearFichas(numjug,color,numFichas);
              if(data === color){
                cambioturno = false;
                setestadoTurno("Tira el dado");
              }
              else{
                cambioturno = true;
              } 
              console.log("LLAMANDO A BLOQUEAR FICHAS CON "+color+" "+numjug);
          })
          stompClient.subscribe("/topic/chat/" + idPartida, function (response) {
            // Mensaje de chat recibido
            let data = JSON.parse(response.body);
            console.log("ALGUIEN HA ESCRITO ALGO");
            console.log("usuario del mensaje: "+data.usuario);
            console.log("mensaje: "+data.mensaje);
            //console.log("yo soy : "+cookies.get('nombreusuario'));
            console.log("yo soy : "+miusername);
            if(data.usuario !== miusername){
              console.log("NO ES MI MENSAJE");
              const mensaje = {
                body: data.mensaje,
                from: data.usuario
              }
              //setMessages(()=>mensaje)
              setMessages((prevMessages) => [...prevMessages, mensaje]);
            }
            else{
              console.log("MENSAJE MIO, LO IGNORO");
            }
            
        })
        stompClient.subscribe("/topic/pausa/" + idPartida, function (response) {
          // Alguien ha parado la partida
          let data = JSON.parse(response.body);
          setpartidaenPausa(data);
        })
        stompClient.subscribe("/topic/salir/" + idPartida, function (response) {
          // Alguien ha salido de la partida
          let data = JSON.parse(response.body);
          console.log("ALGUIEN HA SALIDO DE LA PARTIDA: "+data);
          reconexion = false;
          // eslint-disable-next-line
          eval(`setUsername${data}(null)`);

        })
        stompClient.subscribe("/topic/ultimo/" + idPartida, function (response) {
          // Estoy yo solo en la partida, he ganado
          let data = JSON.parse(response.body);
          setpartidafinalizada(true);
          if(idtorneo && data){
            setsoyultimofinalista(true);
          }
        })
      })
    }
    connectToSocket();
    // eslint-disable-next-line
  }, [idPartida]);

  useEffect(() => {
    function dibujarfichas(color,numfichas,tematica){
      let maxfichas,i,ficha;
      if(numfichas === "RAPIDO"){
        maxfichas = 2;
      }
      else{
        maxfichas = 4;
      }
      for (i = 1; i <= maxfichas; i++) {
        ficha = '.ficha'+i+color;
        ficha = document.querySelector(ficha);
        if(tematica === "halloween"){
          console.log("dibujando ficha de halloween");
          ficha.style.backgroundImage = `url(${calabaza1})`;
          ficha.style.backgroundPosition = "center";
          ficha.style.backgroundRepeat = "no-repeat";
          ficha.style.backgroundSize = "30px 30px";
        }
        else if (tematica === "navidad"){
          console.log("dibujando ficha de halloween");
          ficha.style.backgroundImage = `url(${nie})`;
          ficha.style.backgroundPosition = "center";
          ficha.style.backgroundRepeat = "no-repeat";
          ficha.style.backgroundSize = "30px 30px";
        }
      }
    }
    async function asignarfichas(color,numfichas) {
      await axios.get("https://lamesa-backend.azurewebsites.net/usuario/ficha-activa/"+idUsuario)
      .then ( response => {
        console.log("fichas activas: ",response.data);
        console.log("id de la ficha activa: "+response.data.id)

        if(response.data.id === 5){
          console.log("voy a dibujar fichas")
          dibujarfichas(color,numfichas,"halloween");
        }
        else if(response.data.id === 6){
          dibujarfichas(color,numfichas,"navidad");
        }
      })
    }

    if (primeravez && state) {
      setprimeravez(false);
      setIdPartida(state.id_part);
      setColor(state.col);
      settipopart(state.tipo);
      setnumFichas(state.num_fichas);
      const jugadores = state.jug;
      if(state.tipo === "torneo" || state.tipo === "torneoFinal"){
        setnombretorneo(state.nombreTorneo);
        setidtorneo(state.idTorneo);
      }
      if(state.reconexion === "reconexion"){
        setpartidaempezada(true);
        setpartidaenPausa(true);
        setturno(state.turno);
        reconexion = true;
        let miusername = cookies.get('nombreUsuario');
        if(state.col === "AMARILLO"){
          setUsernameAMARILLO(miusername);
        }
        else if(state.col === "AZUL"){
          setUsernameAZUL(miusername);
        }
        else if (state.col === "ROJO"){
          setUsernameROJO(miusername);
        }
        else if(state.col === "VERDE"){
          setUsernameVERDE(miusername);
        }
        
        for(let i =0; i< jugadores.length;i++){
          if(jugadores[i].color === "AMARILLO"){
            setUsernameAMARILLO(jugadores[i].username);
          }
          else if(jugadores[i].color === "AZUL"){
            setUsernameAZUL(jugadores[i].username);
          }
          else if (jugadores[i].color === "ROJO"){
            setUsernameROJO(jugadores[i].username);
          }
          else if(jugadores[i].color === "VERDE"){
            setUsernameVERDE(jugadores[i].username);
          }
        }
        setfichasTablero(state.fichas_en_tablero);
      }
      else{
        reconexion = false;
        function comprobarUsernames(){
          if(state.col==="AMARILLO"){
            setUsernameAMARILLO(cookies.get('nombreUsuario'));
            setNumjugadores(1);
          }
          else if(state.col === "AZUL"){
            setUsernameAMARILLO(jugadores && jugadores[0].username);
            setUsernameAZUL(cookies.get('nombreUsuario'));
            setNumjugadores(2);
          }else if(state.col ==="ROJO"){
            setUsernameAMARILLO(jugadores && jugadores[0].username);
            setUsernameAZUL(jugadores && jugadores[1].username);
            setUsernameROJO(cookies.get('nombreUsuario'));
            setNumjugadores(3);
          }else if(state.col ==="VERDE"){
            if(state.tipo === "publica"){
              setpartidaempezada(true);
            }
            setUsernameAMARILLO(jugadores && jugadores[0].username);
            setUsernameAZUL(jugadores && jugadores[1].username);
            setUsernameROJO(jugadores && jugadores[2].username);
            setUsernameVERDE(cookies.get('nombreUsuario'));
            setNumjugadores(4);
          }
        }
        comprobarUsernames();
      }
      asignarfichas(state.col,state.num_fichas);
    }
    // eslint-disable-next-line
  }, [cookies,primeravez,state]);

  useEffect(() => {
    if(reconexion){      
      for(let i = 0; i<fichasTablero.length;i++){
        const listaInterna = fichasTablero[i];
        console.log("listaInerna",listaInterna);
        for (let j = 0; j < listaInterna.length; j++) {
          const ficha = listaInterna[j];
          console.log("usernameamarillo: "+usernameAMARILLO);
          console.log("usernameazul: "+usernameAZUL);
          moverFicha(ficha.numero,parseInt(ficha.casilla.posicion)+1,ficha.color,ficha.casilla.tipo);
        }          
      }
    }
    // eslint-disable-next-line
  },[usernameAMARILLO,usernameAZUL,usernameROJO,usernameVERDE]);

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
    bloquearFichas(numjugadores,color,numFichas);
    setIsPlaying(true);
    await new Promise(resolve => setTimeout(resolve, 3500));
    setIsPlaying(false);
    return Promise.resolve();
  };
  
  async function enviarComienzopartida(){
    await axios.post("https://lamesa-backend.azurewebsites.net/partida/empezar/"+idPartida)
    .then(response => {
      setturno(response.data);
      if(response.data === color){
        setestadoTurno("Tira el dado");
      }
      setpartidaempezada(true);

    })
    .catch(error =>{
      const botonStart = document.querySelector('.empezarPartida');
      botonStart.style.display = 'block';
      seterroriniciarpartida(error.response.data);
    })
    
  }
  function startpartida(){
    const botonStart = document.querySelector('.empezarPartida');
    botonStart.style.display = 'none';
    seterroriniciarpartida("");
    bloquearFichas(numjugadores,color,numFichas);
    enviarComienzopartida();
  }
  async function gestionarenviodado(juegoautonomo){
    await handleStart();
    console.log("enviando y actualizando DADO: "+dadoRef.current);
    setnumDado(dadoRef.current);
    enviarDado(dadoRef.current,setturno,turno,idPartida,color,setpartidafinalizada,juegoautonomo,setmostrartimer,numFichas,setestadoTurno,setfichaenmeta,setfichacomida);
  }
  const onClick = () => {
    setestadoTurno("Espera por favor");
    const botonTirarDado = document.querySelector('.tirarDado');
    botonTirarDado.style.display = 'none';
    setbotondadopulsado(true);
    setjuegoautomatico(false);
    console.log("boton tirar dado pulsado");
    gestionarenviodado(false);
  };

  function handleTimeUp() {
    setestadoTurno("");
    console.log("ENTRANDO EN HANDLETIMEUP");
    console.log("turno: "+turno);
    console.log("color: "+color);
    if(turno === color){
      if(fichacomida || fichaenmeta){
        setfichapulsada(true);
        setjuegoautomatico(true);
        if(fichasdisponibles.length !== 0) {
          let numficha = fichasdisponibles[0];
          console.log("FICHA A ENVIAR DESDE TIMEUP "+numficha);
          console.log("DADO A ENVIAR DESDE TIMEUP "+numDado);
          colorearFichas(color,numFichas);
          if(fichacomida){
            enviarFicha(numficha,idPartida,20,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautomatico,numFichas,setfichaenmeta,setfichacomida);
          }
          else if(fichaenmeta){
            enviarFicha(numficha,idPartida,10,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautomatico,numFichas,setfichaenmeta,setfichacomida);
          }
        }
      }
      else if(!botondadopulsado){
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
          colorearFichas(color,numFichas);
          enviarFicha(numficha,idPartida,numDado,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautomatico,numFichas,setfichaenmeta,setfichacomida);
        }
      }
    }
  }

  const fichaPulsada = (numficha, color) => {
    setestadoTurno("Espera por favor");
    setfichapulsada(true);
    setjuegoautomatico(false);
    console.log("FICHA PULSADA");
    let ficha = '.ficha'+numficha+color;
    console.log("INHABILITANDO FICHA: "+ ficha);
    let fichacambiar = document.querySelector(ficha);
    fichacambiar.disabled = true;
    bloquearFichas(numjugadores,color,numFichas);
    colorearFichas(color,numFichas);
    fichasdisponibles = [];
    if(fichacomida){
      setfichacomida(false);
      enviarFicha(numficha,idPartida,20,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautomatico,numFichas,setfichaenmeta,setfichacomida);
    }
    else if(fichaenmeta){
      setfichaenmeta(false);
      enviarFicha(numficha,idPartida,10,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautomatico,numFichas,setfichaenmeta,setfichacomida);
    }
    else{
      enviarFicha(numficha,idPartida,numDado,setturno,turno,color,setpartidafinalizada, setmostrartimer,setestadoTurno,juegoautomatico,numFichas,setfichaenmeta,setfichacomida);
    }
  };
  async function enviarmensaje(message){
    console.log("ENVIANDO MENSAJE: "+message);
    stompcl.send("/app/chat/" + idPartida, {}, JSON.stringify({
      usuario: cookies.get('nombreUsuario'),
      mensaje: message
    }));
    console.log("MENSAJE ENVIADO CON: "+cookies.get('nombreUsuario')+ " y "+message);
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
  useEffect(() => {
    const divFuegosArtificiales = document.getElementById("fuegosArtificiales");
    if (divFuegosArtificiales) {
      const scriptFuegosArtificiales = document.createElement("script");
      scriptFuegosArtificiales.src = "https://dl.dropboxusercontent.com/s/qhmfmwu7ckig9l2/fartificiales.js";
      divFuegosArtificiales.appendChild(scriptFuegosArtificiales);
    }
  }, []);
  
  useEffect(() => {
    window.onbeforeunload = function() {
      salirPartida();
    };
    // eslint-disable-next-line
  }, []);
  
  async function pausarPartida(){
    setShowModalAjustes(false);
    await axios.post("https://lamesa-backend.azurewebsites.net/partida/pausa/"+ idPartida)
    .then(response => {
      setpartidaenPausa(true);
    })  
  }
  async function salirPartida(){
    console.log("saliendo con: "+idUsuario);
    console.log("saliendo con: "+idPartida);
    await axios.post("https://lamesa-backend.azurewebsites.net/partida/salir", {jugador:idUsuario,partida:idPartida})
    .then(response => {
      navigate(process.env.PUBLIC_URL+'/principal');
    })
  }
  function salirtrasParacabada(){
    console.log("SALIENDO DE LA PARTIDA TRAS TERMINAR")
    navigate(process.env.PUBLIC_URL+'/principal');
  }
  function jugarFinalTorneo(){
    let soy16 = soyultimofinalista;
    navigate(process.env.PUBLIC_URL+'/esperarfinal',{ state: { nombretorneo,idtorneo, soy16 } });
  }

  return (  
    <>


     <div>
        {partidaempezada && <Button className="ajustesboton" onClick={() => {setShowModalAjustes(true);}}></Button>}
        <Modal 
          show={showModalAjustes} 
          onHide={() => setShowModalAjustes(false)} 
          centered
          className="custom-modal-partida"
          >
          <Modal.Header>
            <Button className="cerrarModal" onClick={() => {
              setShowModalAjustes(false);
            }}>X</Button>
            <Modal.Title className="modalTitle">AJUSTES</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {color === turno && <button 
                className="botonpause" onClick={() => pausarPartida()}
                onMouseEnter={() => setMostrarBocadillo(true)}
                onMouseLeave={() => setMostrarBocadillo(false)}>PAUSAR PARTIDA</button>}
            <button className="botonexit" onClick={() => {setShowModalSeguroSalirPar(true);setShowModalAjustes(false)}}>SALIR DE LA PARTIDA</button>
            {mostrarBocadillo && (
              <p className="bocadillopause">
                Este botón te permite pausar la partida y poder seguir jugando en otro dispositivo. <br></br>
                Puedes utilizar este botón solo 2 veces a lo largo de la partida.
              </p>
            )} 
          </Modal.Body>
        </Modal>
        <Modal 
            show={showModalSeguroSalirPar} 
            onHide={() => setShowModalSeguroSalirPar(false)} 
            centered
            className="custom-modal-segurosalir"
        >
        <Modal.Header>
        <Button className="cerrarModal" onClick={() => {
            setShowModalSeguroSalirPar(false);
        }}>X</Button>
        <Modal.Title className="modalTitle">¿Seguro que quieres abandonar la partida?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="button-container">
                <button className="siboton" onClick={() => salirPartida()}>Sí</button>
                <button className="noboton" onClick={() => setShowModalSeguroSalirPar(false)} style={{ marginRight: "5%" }}>No</button>
            </div>
        </Modal.Body>
        </Modal>
        <button className="abrirChat"onClick={() => setShowChat(!showChat)}>
          CHAT
        </button>
        {showChat &&
        <div className="chat">
            <ul>
            {messages.map((message,index) => (
              <li key={index} style={{
                backgroundImage: message.from === "Yo" 
                  ? `linear-gradient(to right, transparent ${100 - (message.body.length / 30.0) * 100}%, #acc997)` 
                  : `linear-gradient(to left, transparent ${100 - (message.body.length / 30.0) * 100}%, #acc997)`
              }}>
                <p style={{
                  textAlign: message.from === "Yo" ? 'right' : 'left',
                  fontWeight: 'bold',
                  fontSize: '1.4em'
                }}>
                  {message.from}: 
                </p>
                <p style={{
                  textAlign: message.from === "Yo" ? 'right' : 'left',
                  fontSize: '1.2em'
                }}>
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
      </div>    
      <div className="lamesa">
        <div className="icono"></div>
          <div className={halloween? "show-hall":"no-show"} >
            <img className="hueso" src={hueso} alt="" />  
            <img className="hueso1" src={hueso} alt="" />  
            <img className="hueso2" src={hueso} alt="" />  
            <img className="hueso3" src={hueso} alt="" />  
            <img className="calavera" src={calavera} alt="" />
            <img className="calabaza" src={calabaza} alt="" />
            <img className="fantasma" src={fantasma} alt="" />
          </div>
          <div className={navidad? "show-nav":"no-show-nav"} >
                <img className="arbol" src={arbol} alt="" />
                <img className="regalo" src={regalo} alt="" />
                <img className="nieve" src={nieve} alt="" />
                <img className="nieve1" src={nieve} alt="" />
                <img className="nieve2" src={nieve} alt="" />
              

              
          </div>
          {color === "AMARILLO" && 
          tipopart==="privada" &&
          <button className="empezarPartida" onClick={startpartida}>
          Comenzar Partida
          </button>
          }
          {color !== "AMARILLO" && tipopart==="privada" && !partidaenPausa && !partidaempezada && <p className="infoParAcabada">ESPERA A QUE EL ANFITRIÓN INICIE LA PARTIDA</p> }
          {tipopart!=="privada" && !partidaenPausa && !partidaempezada && <p className="infoParAcabada">ESPERANDO AL RESTO DE JUGADORES</p> }
          {partidaenPausa && <button className="infopause">LA PARTIDA HA SIDO PAUSADA <br></br> Duración de 1 minuto</button>}
        {partidafinalizada && !partidaenPausa && <p className="infoParAcabada">
        ¡LA PARTIDA SE ACABÓ!{turno === color ? <><br/><br/>¡FELICIDADES!</> : <><br/><br/>OTRA VEZ SERÁ</>}
        </p>}
        {tipopart === "torneo" && turno === color && partidafinalizada && !partidaenPausa && <button className="salirboton" onClick={() => jugarFinalTorneo()} >JUGAR FINAL</button>}
        
        {tipopart === "torneo" && turno !== color && partidafinalizada && !partidaenPausa && <button className="salirboton" onClick={() => salirtrasParacabada()} >SALIR DEL TORNEO</button>}
        {tipopart !== "torneo" && partidafinalizada && !partidaenPausa && <button className="salirboton" onClick={() => salirtrasParacabada()} >SALIR DE LA PARTIDA</button>}
        {partidafinalizada && turno===color  && !partidaenPausa && <div id="fuegosArtificiales"></div>}
        {erroriniciarpartida !== "" &&  <p className="mensajeErrorPartida">{erroriniciarpartida}</p>}
        {turno === color && !partidaenPausa && partidaempezada && !partidafinalizada && <p className={"infoTurno"+color}>
          ¡ES TU TURNO!<br></br> {estadoTurno}</p>}
        {turno !== color && !partidaenPausa &&  partidaempezada && !partidafinalizada &&
        // eslint-disable-next-line
        <p className={"infoTurno"+turno}>Turno de <br></br> {eval("username"+turno)}</p>
        }
        {color === turno && !partidaenPausa && !partidafinalizada && juegoautomatico && <p className={"infoTurno"+color}>JUGANDO AUTOMÁTICAMENTE DURANTE 1 TURNO</p>}
            
          <h1 className="usernameVerde" >{usernameVERDE}</h1>
          <h1 className="usernameAmarillo">{usernameAMARILLO}</h1> 
          <h1 className="usernameRojo">{usernameROJO}</h1>
          <h1 className="usernameAzul">{usernameAZUL}</h1>
        {usernameAZUL && (
          <>
            {numFichas === "NORMAL" ? (
              <>
              <button className="ficha1AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "AZUL") : null}></button>
              <button className="ficha2AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 2, "AZUL") : null}></button>
              <button className="ficha3AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 3, "AZUL") : null}></button>
              <button className="ficha4AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 4, "AZUL") : null}></button>
              </>
            ) : numFichas === "RAPIDO" ? (
              <>
                <button className="ficha1AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "AZUL") : null}></button>
                <button className="ficha2AZUL" onClick={partidaempezada ? fichaPulsada.bind(null, 2, "AZUL") : null}></button>
              </>
            ) : null}
          </>
        )}
        {usernameROJO && (
          <>
            {numFichas === "NORMAL" ? (
              <>
                <button className="ficha1ROJO" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "ROJO") : null}></button>
                <button className="ficha2ROJO" onClick={partidaempezada ? fichaPulsada.bind(null, 2, "ROJO") : null}></button>
                <button className="ficha3ROJO" onClick={partidaempezada ? fichaPulsada.bind(null, 3, "ROJO"): null}></button>
                <button className="ficha4ROJO" onClick={partidaempezada ? fichaPulsada.bind(null, 4, "ROJO"): null}></button>
              </>
            ) : numFichas === "RAPIDO" ? (
              <>
                <button className="ficha1ROJO" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "ROJO") : null}></button>
                <button className="ficha2ROJO" onClick={partidaempezada ? fichaPulsada.bind(null, 2, "ROJO") : null}></button>
              </>
            ) : null}
          </>
        )}
        {usernameAMARILLO && (
          <>
            {numFichas === "NORMAL" ? (
              <>
                <button className="ficha1AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 1, "AMARILLO") : null}></button>
                <button className="ficha2AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 2, "AMARILLO") : null}></button>
                <button className="ficha3AMARILLO" onClick={partidaempezada ? fichaPulsada.bind(null, 3, "AMARILLO") : null}></button>
                <button className="ficha4AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 4, "AMARILLO") : null}></button>
              </>
            ) : numFichas === "RAPIDO" ? (
              <>
                <button className="ficha1AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 1, "AMARILLO") : null}></button>
                <button className="ficha2AMARILLO"  onClick={partidaempezada ? fichaPulsada.bind(null, 2, "AMARILLO") : null}></button>
              </>
            ) : null}
          </>
        )}
        {usernameVERDE && (
          <>
            {numFichas === "NORMAL" ? (
              <>
                <button className="ficha1VERDE" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "VERDE") : null}></button>
                <button className="ficha2VERDE" onClick={partidaempezada ? fichaPulsada.bind(null, 2, "VERDE") : null}></button>
                <button className="ficha3VERDE" onClick={partidaempezada ? fichaPulsada.bind(null, 3, "VERDE") : null}></button>
                <button className="ficha4VERDE" onClick={partidaempezada ? fichaPulsada.bind(null, 4, "VERDE") : null}></button>
              </>
            ) : numFichas === "RAPIDO" ? (
              <>
                <button className="ficha1VERDE" onClick={partidaempezada ? fichaPulsada.bind(null, 1, "VERDE") : null}></button>
                <button className="ficha2VERDE" onClick={partidaempezada ? fichaPulsada.bind(null, 2, "VERDE") : null}></button>
              </>
            ) : null}
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
      {color === turno  && !partidaenPausa  &&  !partidafinalizada && <button className="tirarDado" onClick={onClick}>
        Tirar dado
      </button>}
    <div>
      {!mostrartimer && !partidaenPausa && color === turno &&  !partidafinalizada && <Timer onTimeUp={handleTimeUp}></Timer>}
      {mostrartimer && !partidaenPausa && !partidafinalizada && <Timer onTimeUp={handleTimeUp}></Timer>}
    </div>
    </>
  );
}
export default Partida;
