import React, { useState, useEffect} from "react";
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
//prueba en azure
// function NuevoJugador(data){

// }
function connectToSocket(idPartida,setturno,actualizarTablero,color,inhabilitarFichas) {
  const url = "https://lamesa-backend.azurewebsites.net"
  console.log("connecting to the game");
  let socket = new SockJS(url + "/ws");
  let stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
      // stompClient.subscribe("/topic/nuevo-jugador/" + idPartida, function (response) {
      //     // Un jugador se ha unido a la partida (cuando aún no ha empezado)
      //     let data = JSON.parse(response.body);
      //     console.log("Datos recibidos del SOCKET (JUGADOR UNIENDOSE A PARTIDA): "+ data);
      //     NuevoJugador(data);
      // })
      stompClient.subscribe("/topic/dado/" + idPartida, function (response) {
          // Un jugador ha sacado ficha de casa -> Actualizar tablero
          let data = JSON.parse(response.body);
          if(color !== data.fichas[0].color && data.sacar){
            actualizarTablero(data.fichas[0].numero,parseInt(data.casilla.posicion)+1,data.fichas[0].color);
          }
          inhabilitarFichas(color);
          console.log("LLEGA TURNO DESDE DADO: "+ data.turno);
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
          if(color !== data.color){
            actualizarTablero(data.ficha.numero, parseInt(data.destino.posicion)+1,data.ficha.color);
          }
          setturno(data.turno);
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
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function moverFicha(numficha, numcasilla,color,casillasTablero){
  let ficha, fichamover, casilla;
  casilla = casillasTablero.find(c => c.id === numcasilla);
  ficha = '.ficha'+numficha+color;
  console.log("FICHAAAAA: "+ ficha);
  fichamover = document.querySelector(ficha);
  if(casilla.numfichas===0){
    casilla.numfichas = 1; 
    fichamover.style.left = casilla.left;
    fichamover.style.top = casilla.top;
  }
  else{
    let nuevaCasilla = casillasTablero.find(c => c.id === casilla.id+'-2');
    fichamover.style.left = nuevaCasilla.left;
    fichamover.style.top = nuevaCasilla.top;
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
  const cookies = new Cookies();
  const { state } = useLocation();
  const [idPartida, setIdPartida] = useState(null);
  const [color, setColor] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [usernameAmarillo, setUsernameAmarillo] = useState('');
  const [usernameAzul, setUsernameAzul] = useState('');
  const [usernameRojo, setUsernameRojo] = useState('');
  const [usernameVerde, setUsernameVerde] = useState('');
  const [turno, setturno] = useState('');
  const [numDado, setnumDado] = useState(0);
  let jugadorhatirado = false;
  //const vector = [5,4,4,4,3,3,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2];
  //const [indice, setindice] = useState(0);

  useEffect(() => {
    async function enviarDado(numdado,setturno,idPartida) {
      await sleep(4000); // Espera 4 segundos
      //console.log("ENVIANDO DADO: "+vector[indice]);
      let response;
      console.log("DADO: "+numdado);
      response = await axios.post("https://lamesa-backend.azurewebsites.net/partida/dado/"+idPartida + "?dado="+numdado);
      console.log("RESPUESTA TRAS ENVIAR DADO SACAR: "+response.data.sacar);
      if(response.data.sacar===true){
        moverFicha(response.data.fichas[0].numero,parseInt(response.data.casilla.posicion)+1,color,casillasTablero);
        setturno(response.data.turno);
      }
      else{
        mostrarFichasBloqueadas(response,color);
      }
      //setindice(indice+1);
    }

    function actualizarTablero(numFicha,numcasilla,color){
      const casilla = casillasTablero.find(c => c.id === numcasilla);
      let ficha = '.ficha'+numFicha+color;
      console.log("FICHA DE OTRO JUGADOR: "+ ficha);
      const ficha1 = document.querySelector(ficha);
      if(casilla.numfichas===0){
        console.log("CASILLA SIN FICHAS");
        casilla.numfichas = 1; 
        ficha1.style.left = casilla.left;
        ficha1.style.top = casilla.top;
      }
      else{
        console.log("CASILLA CON 1 FICHA");
        const nuevaCasilla = casillasTablero.find(c => c.id === casilla.id+'-2');
        ficha1.style.left = nuevaCasilla.left;
        ficha1.style.top = nuevaCasilla.top;
      }
    }

    connectToSocket(idPartida,setturno, actualizarTablero,color,inhabilitarFichas);
    if (state) {
      setIdPartida(state.id_part);
      setColor(state.col);
      setJugadores(state.jugadores);
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
    else{
      setnumDado(parseInt(currentPhotoIndex)+1);
      enviarDado(parseInt(currentPhotoIndex)+1,setturno,idPartida);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying,currentPhotoIndex,state, idPartida, casillasTablero,color]);

  function comprobarUsernames(){
    if(color==="AMARILLO"){
      setUsernameAmarillo(cookies.get('nombreUsuario'));
    }
    else if(color === "AZUL"){
      setUsernameAmarillo(jugadores[0].username);
      setUsernameAzul(cookies.get('nombreUsuario'));
    }else if(color ==="ROJO"){
      setUsernameAmarillo(jugadores[0].username);
      setUsernameAzul(jugadores[1].username);
      setUsernameRojo(cookies.get('nombreUsuario'));
    }else if(color ==="VERDE"){
      setUsernameAmarillo(jugadores[0].username);
      setUsernameAzul(jugadores[1].username);
      setUsernameRojo(jugadores[2].username);
      setUsernameVerde(cookies.get('nombreUsuario'));
    }
  }
  
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
    enviarComienzopartida();
    const botonStart = document.querySelector('.empezarPartida');
    botonStart.style.display = 'none';
  }
  const onClick = () => {
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
    moverFicha(numficha,parseInt(response.data.destino.posicion)+1,color,casillasTablero);
    setturno(response.data.turno);
    inhabilitarFichas(color);
  }
  const fichaPulsada = (numficha, color) => {
    console.log("FICHA PULSADA");
    enviarFicha(numficha);
  };

  return (  
    <>
    {comprobarUsernames}
      <p>El id es {idPartida}</p>;
      <p>El color es {color}</p>;
      <p>Turno de {turno}</p>
      <div>
        {color === "AMARILLO" && <h1 className="usernameAmarillo">{cookies.get('nombreUsuario')}</h1>&&
        <h1 className="usernameRojo">{usernameRojo}</h1>&&
        <h1 className="usernameAzul">{usernameAzul}</h1>&&
        <h1 className="usernameVerde">{usernameVerde}</h1>
        // <button className="empezarPartida" onClick={startpartida}>
        // Comenzar Partida
        // </button>
        }
        
        {color === "VERDE" && <h1 className="usernameVerde" >{cookies.get('nombreUsuario')}</h1> && 
        <h1 className="usernameAmarillo">{usernameAmarillo}</h1> &&
        <h1 className="usernameRojo">{usernameRojo}</h1>&&
        <h1 className="usernameAzul">{usernameAzul}</h1>}

        {color === "ROJO" && <h1 className="usernameRojo" >{cookies.get('nombreUsuario')}</h1>&&
        <h1 className="usernameAmarillo">{usernameAmarillo}</h1>&&
        <h1 className="usernameAzul">{usernameAzul}</h1>&&
        <h1 className="usernameVerde">{usernameVerde}</h1>}

        {color === "AZUL" && <h1 className="usernameAzul" >{cookies.get('nombreUsuario')}</h1>&&
        <h1 className="usernameAmarillo">{usernameAmarillo}</h1>&&
        <h1 className="usernameRojo">{usernameRojo}</h1>&&
        <h1 className="usernameVerde">{usernameVerde}</h1>}
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
    {<Timer timeLimit={6} onTimeUp={handleTimeUp} />}
    </div>
    </>
  );
}
export default Partida;
