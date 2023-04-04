import React, { useState, useEffect} from "react";
import "../styles/Partida.css";
import Timer from './Timer';
import {casillas} from './Casillas.jsx'

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


function Partida(props) {
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  //const [numeroObtenidoDado, setnumeroObtenidoDado] = useState(0);
  <p>El id es {props.idPartida}</p>;
  <p>El color es {props.color}</p>;
  useEffect(() => {

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
        console.log(casilla.id);
        casilla.numfichas = 1; 
        ficha1.style.left = casilla.left;
        ficha1.style.top = casilla.top;
      }
      else{
        const nuevaCasilla = casillas.find(c => c.id === casilla.id+'-2');
        console.log(casilla.id);
        console.log(nuevaCasilla.left);
        ficha1.style.left = nuevaCasilla.left;
        ficha1.style.top = nuevaCasilla.top;
        
      }
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, currentPhotoIndex]);


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
      <div class="lamesa">
        <div class="icono"></div>
        <div class="ficha1azul"></div>
        <div class="ficha2azul"></div>
        <div class="ficha3azul"></div>
        <div class="ficha4azul"></div>
        <div class="ficha1rojo"></div>
        <div class="ficha2rojo"></div>
        <div class="ficha3rojo"></div>
        <div class="ficha4rojo"></div>
        <div class="ficha1amarillo"></div>
        <div class="ficha2amarillo"></div>
        <div class="ficha3amarillo"></div>
        <div class="ficha4amarillo"></div>
        <div class="ficha1verde"></div>
        <div class="ficha2verde"></div>
        <div class="ficha3verde"></div>
        <div class="ficha4verde"></div> 
        <div class="azul"></div>
        <div class="rojo"></div>
        <div class="amarillo"></div>
        <div class="verde"></div>
        <div class="azulb"></div>
        <div class="rojob"></div>
        <div class="amarillob"></div>
        <div class="verdeb"></div>
        <div class="azulc"></div>
        <div class="rojoc"></div>
        <div class="amarilloc"></div>
        <div class="verdec"></div>
        <div class="azuld"></div>
        <div class="rojod"></div>
        <div class="amarillod"></div>
        <div class="verded"></div>

        <div class="verdee">         
          <div class="filas"></div>
          <div class="filas f1"></div>
          <div class="filas f2"></div>
          <div class="filas f3"></div>
          <div class="filas f4"></div>
          <div class="filas f5"></div>
          <div class="filas f6"></div>
          <div class="filas f7"></div>
          <div class="filab f8"></div>
          <div class="filab f9"></div>
          <div class="filab f10"></div>
          <div class="filab f11"></div>
          <div class="filab f12"></div>
          <div class="filab f13"></div>
          <div class="filab f14"></div>
          <div class="filab f15"></div>
          <div class="filac f16"></div>
          <div class="filac f17"></div>
          <div class="filac f18"></div>
          <div class="filac f19"></div>
          <div class="filac f20"></div>
          <div class="filac f21"></div>
          <div class="filac f22"></div>
          <div class="filac f23"></div>
          <div class="filad f24"></div>
          <div class="filad f25"></div>
          <div class="filad f26"></div>
          <div class="filad f27"></div>
          <div class="filad f28"></div>
          <div class="filad f29"></div>
          <div class="filad f30"></div>
          <div class="filad f31"></div> 
          <div class="filae incli1"></div>
          <div class="filae incli2"></div>
          <div class="filae incli3"></div>
          <div class="filae incli4"></div>   
          <div class="filae derpasamarillo"></div>  
          <div class="filae izqpasamarillo"></div>
          <div class="filae derpasrojo"></div>  
          <div class="filae izqpasrojo"></div>
          <div class="filae debpasazul"></div>  
          <div class="filae arrpasazul"></div>     
          <div class="filae debpasverde"></div>  
          <div class="filae arrpasverde"></div>    
          <i class="star s1 fa fa-star"></i>
          <i class="star s2 fa fa-star"></i>   
          <div class="s3">
          <i class="ss3 fa fa-star"></i></div>      
          <div class="s4">
          <i class="ss4 fa fa-star"></i></div>         
          <div class="s5">
          <i class="ss5 fa fa-star"></i></div>           
          <i class="star s6 fa fa-star"></i>      
          <i class="star s7 fa fa-star"></i>
          <i class="star s8 fa fa-star"></i>
          <div class="s9">
          <i class="ss9 fa fa-star"></i></div>    
          <div class="s10">
          <i class="ss10 fa fa-star"></i></div>             
          <div class="s11">
          <i class="ss11 fa fa-star"></i></div>
          <i class="star s12 fa fa-star"></i> 

          <div class="numeros"></div>
          <div class="numeros n1">1</div>
          <div class="numeros n2">2</div>
          <div class="numeros n3">3</div>
          <div class="numeros n4">4</div>
          <div class="numeros n5">5</div>
          <div class="numeros n6">6</div>
          <div class="numeros n7">7</div>
          <div class="numeros n8">8</div>
          <div class="numerosb"></div>
          <div class="numerosb n9">9</div>
          <div class="numerosb n10">10</div>
          <div class="numerosb n11">11</div>
          <div class="numerosb n12">12</div>
          <div class="numerosb n13">13</div>
          <div class="numerosb n14">14</div>
          <div class="numerosb n15">15</div>
          <div class="numerosb n16">16</div>
          <div class="numerosb n17">17</div>
          <div class="numerosb n18">18</div>
          <div class="numerosb n19">19</div>
          <div class="numerosb n20">20</div>
          <div class="numerosb n21">21</div>
          <div class="numerosb n22">22</div>
          <div class="numerosb n23">23</div>
          <div class="numerosb n24">24</div>
          <div class="numerosb n25">25</div>
          
          <div class="numeros n26">26</div>
          <div class="numeros n27">27</div>
          <div class="numeros n28">28</div>
          <div class="numeros n29">29</div>
          <div class="numeros n30">30</div>
          <div class="numeros n31">31</div>
          <div class="numeros n32">32</div>
          <div class="numeros n33">33</div>
          <div class="numeros n34">34</div>
          <div class="numeros n35">35</div>
          <div class="numeros n36">36</div>
          <div class="numeros n37">37</div>
          <div class="numeros n38">38</div>
          <div class="numeros n39">39</div>
          <div class="numeros n40">40</div>
          <div class="numeros n41">41</div>
          <div class="numeros n42">42</div>
          
          <div class="numerosb n43">43</div>
          <div class="numerosb n44">44</div>
          <div class="numerosb n45">45</div>
          <div class="numerosb n46">46</div>
          <div class="numerosb n47">47</div>
          <div class="numerosb n48">48</div>
          <div class="numerosb n49">49</div>
          <div class="numerosb n50">50</div>
          <div class="numerosb n51">51</div>
          <div class="numerosb n52">52</div>
          <div class="numerosb n53">53</div>
          <div class="numerosb n54">54</div>
          <div class="numerosb n55">55</div>
          <div class="numerosb n56">56</div>
          <div class="numerosb n57">57</div>
          <div class="numerosb n58">58</div>
          <div class="numerosb n59">59</div>
          
          <div class="numeros n60">60</div>
          <div class="numeros n61">61</div>
          <div class="numeros n62">62</div>
          <div class="numeros n63">63</div>
          <div class="numeros n64">64</div>
          <div class="numeros n65">65</div>
          <div class="numeros n66">66</div>
          <div class="numeros n67">67</div>
          <div class="numeros n68">68</div>       
        </div>
      </div>
      <div class="partidaDado">
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
      <button class="tirarDado" onClick={onClick} disabled={isPlaying}>
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