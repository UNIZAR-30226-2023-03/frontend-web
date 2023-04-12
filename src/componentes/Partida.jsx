import React, { useState, useEffect, useMemo} from "react";
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
  
}

// function actualizarFicha(ficha,nuevaCasilla){
//   estadoFichas = estadoFichas.map((elem) =>
//   elem.ficha === ficha ? {...elem,casilla:nuevaCasilla}: elem);
// }
// function buscarCasilla(ficha){
//   const casilla = estadoFichas.find((elem)=> elem.ficha === ficha);
//   return casilla;
// }

function moverFicha(numficha, numcasilla,casillasTablero,colorficha,tipocasilla){
  console.log(estadoFichas)
  let ficha,fichacss, fichamover, casilla;// casilla_ant;//,casilla_anterior;
  const casillasArray = Object.values(casillasTablero);
  if(tipocasilla ==="CASA"){
    numcasilla = 'inicio-'+colorficha+'-'+numficha;
  }
  else if(tipocasilla ==="PASILLO"){
    numcasilla = 'inicio-'+colorficha+'-'+numficha;
  }
  else if(tipocasilla ==="META"){
    numcasilla ='llegada-'+colorficha+'-'+numficha;
  }
  casilla = casillasArray.find(c => c.id === numcasilla);
  ficha = 'ficha'+numficha+colorficha;
  fichacss = '.'+ficha;
  console.log("FICHA QUE SE VA A MOVER "+fichacss);
  //casilla_ant = buscarCasilla(ficha);
  //casilla_anterior = casillasTablero.find(c => c.id === casilla_ant);
  //casilla_anterior.numfichas = 0;
  fichamover = document.querySelector(fichacss);
  if(casilla.numfichas===0){
    casilla.numfichas = 1; 
    fichamover.style.left = casilla.left;
    fichamover.style.top = casilla.top;
    //actualizarFicha(ficha,numcasilla);
  }
  else{
    casilla = casillasTablero.find(c => c.id === casilla.id+'-2');
    fichamover.style.left = casilla.left;
    fichamover.style.top = casilla.top;
    //actualizarFicha(ficha,numcasilla+'-2');
  }
}

function mostrarFichasBloqueadas(response,color){
  let ficha,fichacambiar,i;
  let fichasBloqueadas = response.data.fichas.map((ficha) => ficha.numero);
  for (i = 1; i <= 4; i++) {
    ficha = '.ficha'+i+color;
    fichacambiar = document.querySelector(ficha);
    if (fichasBloqueadas.includes(i)) {
      //fichacambiar.style.backgroundImage = 'url("..//imagenes/iconos/cruz.png")'; // establece la imagen de fondo
      //fichacambiar.style.backgroundSize = "cover"; // establece el tamaño de la imagen de fondo
      fichacambiar.style.backgroundColor = "rgb(39, 40, 41)"; // establece el color de fondo
    } else {
      console.log("HABILITANDO FICHA: "+ ficha);
      //fichacambiar.setAttribute('disabled', 'false');
    }
  }
}

function inhabilitarFichas(color){
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
    console.log("INHABILITANDO FICHA: "+ ficha);
    //fichacambiar.setAttribute('disabled', 'true');
  }
}

function Partida() {
  const casillasTablero = casillas;
  const cookies = useMemo(() => new Cookies(), []);
  const { state } = useLocation();
  const [idPartida, setIdPartida] = useState(null);
  const [color, setColor] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [usernameAmarillo, setUsernameAmarillo] = useState('');
  const [usernameAzul, setUsernameAzul] = useState('');
  const [usernameRojo, setUsernameRojo] = useState('');
  const [usernameVerde, setUsernameVerde] = useState('');
  const [turno, setturno] = useState('');
  const [numDado, setnumDado] = useState(0);
  let jugadorhatirado = false;
  const [primeravez, setprimeravez] = useState(true);
  const [partidaempezada, setpartidaempezada] = useState(false);
  const [partidafinalizada, setpartidafinalizada] = useState(false);
  const [botondadopulsado, setbotondadopulsado] = useState(false);
  const [indice, setindice] = useState(0);
  

  useEffect(() => {

    function connectToSocket(idPartida,setturno,color,inhabilitarFichas,
      setUsernameRojo,setUsernameAzul,setUsernameVerde,setpartidaempezada,
      setpartidafinalizada) {
      const url = "https://lamesa-backend.azurewebsites.net"
      console.log("connecting to the game");
      let socket = new SockJS(url + "/ws");
      let stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame) {
          stompClient.subscribe("/topic/nuevo-jugador/" + idPartida, function (response) {
              // Un jugador se ha unido a la partida (cuando aún no ha empezado)
              let data = JSON.parse(response.body);
              if(data.color !== color){
                if(data.color ==="ROJO"){
                  setUsernameRojo(data.username);
                }
                else if(data.color ==="AZUL"){
                  setUsernameAzul(data.username);
                }
                else if(data.color ==="VERDE"){
                  setUsernameVerde(data.username);
                  setpartidaempezada(true);
                }
              }
          })
          stompClient.subscribe("/topic/dado/" + idPartida, function (response) {
              // Un jugador ha sacado ficha de casa -> Actualizar tablero
              let data = JSON.parse(response.body);
              if(color !== data.fichas[0].color && data.sacar){
                moverFicha(data.fichas[0].numero, parseInt(data.casilla.posicion)+1,casillasTablero,data.fichas[0].color,data.casilla.tipo);
              }
              inhabilitarFichas(color);
              console.log("LLEGA TURNO DESDE DADO: "+ data.turno);
              console.log("LLEGA TURNO DESDE DADO SACAR: "+ data.sacar);
              console.log("LLEGA TURNO DESDE DADO COLOR FICHA: "+ data.fichas[0].color);
              setturno(data.turno);
    
              //displayResponse(data);
          })
          stompClient.subscribe("/topic/movimiento/" + idPartida, function (response) {
              // Un jugador ha hecho un movimiento -> Actualizar tablero
              let data = JSON.parse(response.body);
              console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO NUMCASILLA: "+data.destino.posicion+1);
              console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO COLOR: "+data.ficha.color);
              console.log("OTRO JUGADOR HA HECHO UN MOVIMIENTO FICHA: "+data.ficha.numero);
              //displayResponse(data);
              if(!data.acabada){
                if(color !== data.color){
                  moverFicha(data.ficha.numero, parseInt(data.destino.posicion)+1,casillasTablero,data.ficha.color,data.destino.tipo);  
                }
                if(data.comida){
                  moverFicha(data.comida.numero,parseInt(data.destino.posicion)+1,casillasTablero,data.comida.color,data.destino.tipo);
                }
                setturno(data.turno);             
              }
              else{
                setpartidafinalizada(true);
              }
          })
          stompClient.subscribe("/topic/turno/" + idPartida, function (response) {
              // Mensaje de turno recibido
              let data = JSON.parse(response.body);
              inhabilitarFichas(color);
              console.log("LLEGA TURNO DESDE TURNO: "+ data);
              setturno(data);
              //displayResponse(data);
          })
        //   stompClient.subscribe("/topic/chat/" + idPartida, function (response) {
        //     // Mensaje de chat recibido
        //     let data = JSON.parse(response.body);
        //     console.log(data);
        //     //displayResponse(data);
        // })
      })
    }
    connectToSocket(idPartida, setturno, color,
      inhabilitarFichas, setUsernameRojo, setUsernameAzul, setUsernameVerde,
      setpartidaempezada,setpartidafinalizada);
  }, [color,idPartida, casillasTablero]);

  useEffect(() => {
    let col = "";
    const vectorAmarillo = [5,6,6,6];
    const vectorAzul = [5,1,5];
    async function enviarDado(numdado,setturno,idPartida) {
      await sleep(4000); // Espera 4 segundos
      let vector;
      if(color === "AMARILLO"){
        vector = vectorAmarillo;
      }
      else{
        vector = vectorAzul;
      }
      let response;
      console.log("ENVIANDO DADO: "+vector[indice]);
      //console.log("DADO: "+numdado);
      //response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/dado/"+idPartida + "?dado="+numdado);
      response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/dado/"+idPartida + "?dado="+vector[indice]);
      console.log("RESPUESTA TRAS ENVIAR DADO SACAR: "+response.data.sacar);
      if(response.data.sacar===true){
        moverFicha(response.data.fichas[0].numero,parseInt(response.data.casilla.posicion)+1,casillasTablero,color,response.data.casilla.tipo);
        setturno(response.data.turno);
      }
      else{
        mostrarFichasBloqueadas(response,color);
      }
      setindice(indice+1);
      setbotondadopulsado(false);
    }

    if (primeravez && state) {
      setprimeravez(false);
      setIdPartida(state.id_part);
      setColor(state.col);
      col = state.col;
      const jugadores = state.jug;
      function comprobarUsernames(){
        if(col==="AMARILLO"){
          setUsernameAmarillo(cookies.get('nombreUsuario'));
        }
        else if(col === "AZUL"){
          setUsernameAmarillo(jugadores && jugadores[0].username);
          setUsernameAzul(cookies.get('nombreUsuario'));
        }else if(col ==="ROJO"){
          setUsernameAmarillo(jugadores && jugadores[0].username);
          setUsernameAzul(jugadores && jugadores[1].username);
          setUsernameRojo(cookies.get('nombreUsuario'));
        }else if(col ==="VERDE"){
          setpartidaempezada(true);
          setUsernameAmarillo(jugadores && jugadores[0].username);
          setUsernameAzul(jugadores && jugadores[1].username);
          setUsernameRojo(jugadores && jugadores[2].username);
          setUsernameVerde(cookies.get('nombreUsuario'));
        }
      }
      comprobarUsernames();
    }
    let intervalId = null;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => {
          let newIndex = prevIndex;
          while (newIndex === prevIndex) {
            newIndex = Math.floor(Math.random() * photos.length);
          }
          return newIndex;
        });
      }, 190);
    }
    else if(partidaempezada && botondadopulsado){
      console.log("enviando y actualizando dado");
      setnumDado(parseInt(currentPhotoIndex)+1);
      enviarDado(parseInt(currentPhotoIndex)+1,setturno,idPartida);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying,currentPhotoIndex,state, idPartida, casillasTablero,color,partidaempezada,primeravez,cookies,indice,botondadopulsado]);


  
  const handleStart = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, getRandomTime());
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
    enviarComienzopartida();
    const botonStart = document.querySelector('.empezarPartida');
    botonStart.style.display = 'none';
  }
  const onClick = () => {
    setbotondadopulsado(true);
    console.log("boton tirar dado pulsado");
    jugadorhatirado = true;
    handleStart();
    const botonTirarDado = document.querySelector('.tirarDado');
    botonTirarDado.style.display = 'none';
  };

  function handleTimeUp() {
    if(jugadorhatirado ===false){
      // setIsPlaying(true);
      // setTimeout(() => {
      //   setIsPlaying(false);
      // }, getRandomTime());
      // const botonTirarDado = document.querySelector('.tirarDado');
      // botonTirarDado.style.display = 'none';
      //enviarDado();
    }
  }
  async function enviarFicha(numficha){
    const response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/movimiento", {partida: idPartida,ficha: numficha,dado: numDado});
    if(!response.data.acabada){
      moverFicha(numficha,parseInt(response.data.destino.posicion)+1,casillasTablero,color,response.data.destino.tipo);
      if(response.data.comida){
        moverFicha(response.data.comida.numero,parseInt(response.data.destino.posicion)+1,casillasTablero,response.data.comida.color,response.data.destino.tipo);
      }
      setturno(response.data.turno);
      inhabilitarFichas(color);
    }
    else{
      setpartidafinalizada(true);
    }

  }
  const fichaPulsada = (numficha, color) => {
    console.log("FICHA PULSADA");
    enviarFicha(numficha);
  };

  return (  
    <>
      <p>El id es {idPartida}</p>
      <p>El color es {color}</p>
      <p>Turno de {turno}</p>
      {partidafinalizada && <p>LA PARTIDA SE ACABÓ!!!!</p>}
      <div>
        {color === "AMARILLO" && 
        <button className="empezarPartida" onClick={startpartida}>
        Comenzar Partida
        </button>
        }
        
        <h1 className="usernameVerde" >{usernameVerde}</h1>
        <h1 className="usernameAmarillo">{usernameAmarillo}</h1> 
        <h1 className="usernameRojo">{usernameRojo}</h1>
        <h1 className="usernameAzul">{usernameAzul}</h1>
      </div>    
      <div className="lamesa">
        <div className="icono"></div>
        <button className="ficha1AZUL" onClick={fichaPulsada.bind(null, 1, "AZUL")}></button>
        <button className="ficha2AZUL" onClick={fichaPulsada.bind(null, 2, "AZUL")}></button>
        <button className="ficha3AZUL" onClick={fichaPulsada.bind(null, 3, "AZUL")}></button>
        <button className="ficha4AZUL" onClick={fichaPulsada.bind(null, 4, "AZUL")}></button>
        <button className="ficha1ROJO" onClick={fichaPulsada.bind(null, 1, "ROJO")}></button>
        <button className="ficha2ROJO" onClick={fichaPulsada.bind(null, 2, "ROJO")}></button>
        <button className="ficha3ROJO" onClick={fichaPulsada.bind(null, 3, "ROJO")}></button>
        <button className="ficha4ROJO" onClick={fichaPulsada.bind(null, 4, "ROJO")}></button>
        <button className="ficha1AMARILLO"  onClick={fichaPulsada.bind(null, 1, "AMARILLO")}></button>
        <button className="ficha2AMARILLO"  onClick={fichaPulsada.bind(null, 2, "AMARILLO")}></button>
        <button className="ficha3AMARILLO" onClick={fichaPulsada.bind(null, 3, "AMARILLO")}></button>
        <button className="ficha4AMARILLO"  onClick={fichaPulsada.bind(null, 4, "AMARILLO")}></button>
        <button className="ficha1VERDE" onClick={fichaPulsada.bind(null, 1, "VERDE")}></button>
        <button className="ficha2VERDE" onClick={fichaPulsada.bind(null, 2, "VERDE")}></button>
        <button className="ficha3VERDE" onClick={fichaPulsada.bind(null, 3, "VERDE")}></button>
        <button className="ficha4VERDE" onClick={fichaPulsada.bind(null, 4, "VERDE")}></button> 
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
      {color === turno && <button className="tirarDado" onClick={onClick} disabled={isPlaying}>
        Tirar dado
      </button>}
    <div>
    {<Timer timeLimit={60} onTimeUp={handleTimeUp} />}
    </div>
    </>
  );
}
export default Partida;
