import React, { useState, useEffect} from "react";
import "../styles/Partida.css";
import Timer from './Timer';
import {casillas} from './Casillas.jsx'
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Cookies from 'universal-cookie';

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

function NuevoJugador(data){

}


function connectToSocket(idPartida) {
  const url = "http://localhost:8080"
  console.log("connecting to the game");
  let socket = new SockJS(url + "/ws");
  let stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
      console.log("connected to the frame: " + frame);
      stompClient.subscribe("/topic/nuevo-jugador/" + idPartida, function (response) {
          // Un jugador se ha unido a la partida (cuando aún no ha empezado)
          let data = JSON.parse(response.body);
          console.log("datos que me llegan del socket")
          console.log(data);
          NuevoJugador(data);
      })
      stompClient.subscribe("/topic/salida/" + idPartida, function (response) {
          // Un jugador ha sacado ficha de casa -> Actualizar tablero
          let data = JSON.parse(response.body);
          console.log(data);
          //displayResponse(data);
      })
      stompClient.subscribe("/topic/movimiento/" + idPartida, function (response) {
          // Un jugador ha hecho un movimiento -> Actualizar tablero
          let data = JSON.parse(response.body);
          console.log(data);
          //displayResponse(data);
      })
      stompClient.subscribe("/topic/chat/" + idPartida, function (response) {
          // Mensaje de chat recibido
          let data = JSON.parse(response.body);
          console.log(data);
          //displayResponse(data);
      })
  })
}

function Partida() {
  const cookies = new Cookies();
  const { state } = useLocation();
  const [idPartida, setIdPartida] = useState(null);
  const [color, setColor] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [jugadores, setJugadores] = useState([]);
 
  connectToSocket(idPartida)
  useEffect(() => {
    if (state) {
      setIdPartida(state.id_part);
      setColor(state.col);
      setJugadores(state.jugadores);     
      // if(state.jugadores.length > 0){
      //   //const secondData = dataArray[1];
      //   //console.log("username usuario 2"+ secondData.username);
      //   //console.log("color usuario 2"+ secondData.color);
      // }
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
      const casilla = casillas.find(c => c.id === currentPhotoIndex+1);
      const ficha1 = document.querySelector('.ficha1azul');
      if (casilla.numfichas===0){
       
        casilla.numfichas = 1; 
        ficha1.style.left = casilla.left;
        ficha1.style.top = casilla.top;
      }
      else{
        const nuevaCasilla = casillas.find(c => c.id === casilla.id+'-2');
        ficha1.style.left = nuevaCasilla.left;
        ficha1.style.top = nuevaCasilla.top;
        
      }
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, currentPhotoIndex,state]);

      console.log("COMPROBANDO COLORRRRR");
      if(color === "AZUL"){
        console.log("AMARILLO PARA AZUL: "+jugadores[0].username);
      }else if(color ==="ROJO"){
        console.log("AMARILLO PARA ROJO: "+jugadores[0].username);
        console.log("AZUL PARA ROJO: "+jugadores[1].username);
      }else if(color ==="VERDE"){
        console.log("AMARILLO PARA VERDE: "+jugadores[0].username);
        console.log("AZUL PARA VERDE: "+jugadores[1].username);
        console.log("ROJO PARA VERDE: "+jugadores[2].username);
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

  const onClick = () => {
    handleStart();
  };

  function handleTimeUp() {
    setTimeIsUp(true);
  }

  return (  
    
    <>
      <p>El id es {idPartida}</p>;
      <p>El color es {color}</p>;
      <div>
        {color === "AMARILLO" && <h1 className="usernameAmarillo">{cookies.get('nombreUsuario')}</h1>}
        {color === "VERDE" && <p >{cookies.get('nombreUsuario')}</p>}
        {color === "ROJO" && <p >{cookies.get('nombreUsuario')}</p>}
        {color === "AZUL" && <p >{cookies.get('nombreUsuario')}</p>}
        </div>
      <div className="lamesa">
        <div className="icono"></div>
        <div className="ficha1azul"></div>
        <div className="ficha2azul"></div>
        <div className="ficha3azul"></div>
        <div className="ficha4azul"></div>
        <div className="ficha1rojo"></div>
        <div className="ficha2rojo"></div>
        <div className="ficha3rojo"></div>
        <div className="ficha4rojo"></div>
        <div className="ficha1amarillo"></div>
        <div className="ficha2amarillo"></div>
        <div className="ficha3amarillo"></div>
        <div className="ficha4amarillo"></div>
        <div className="ficha1verde"></div>
        <div className="ficha2verde"></div>
        <div className="ficha3verde"></div>
        <div className="ficha4verde"></div> 
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
      <button className="tirarDado" onClick={onClick} disabled={isPlaying}>
        Tirar dado
      </button>
    <div>
    {<Timer timeLimit={10} onTimeUp={handleTimeUp} />}
      {timeIsUp && <p>¡Se acabó el tiempo!</p>}
    </div>
    </>
  );
}
export default Partida;