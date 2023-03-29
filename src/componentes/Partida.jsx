import React, { useState, useEffect } from "react";
import "../styles/Partida.css";



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

const casillas = [
  {id:1, left:'62%', top:'96%'},
  {id:2, left:'62%', top:'91%'},
  {id:3, left:'62%', top:'86.6%'},
  {id:4, left:'62%', top:'82%'},
  {id:5, left:'62%', top:'77%'},
  {id:6, left:'62%', top:'72.5%'},
  {id:7, left:'62%', top:'68%'},
  {id:8, left:'0%', top:'63%'},
  {id:9, left:'63%', top:'60%'},
  {id:10, left:'67.5%', top:'62%'},
  {id:11, left:'72.5%', top:'62%'},
  {id:12, left:'77%', top:'62%'},
  {id:13, left:'81.5%', top:'62%'},
  {id:14, left:'86.5%', top:'62%'},
  {id:15, left:'91%', top:'62%'},
  {id:16, left:'95.7%', top:'62%'},
  {id:17, left:'95.7%', top:'28.5%'},
  {id:18, left:'95.7%', top:'34%'},
  {id:19, left:'91%', top:'34%'},
  {id:20, left:'86.5%', top:'34%'},
  {id:21, left:'81.5%', top:'34%'},
  {id:22, left:'77%', top:'34%'},
  {id:23, left:'72.5%', top:'34%'},
  {id:24, left:'67.5%', top:'34%'},
  {id:25, left:'63%', top:'36%'},
  {id:26, left:'62%', top:'0%'},
  {id:27, left:'62%', top:'33%'},
  {id:28, left:'62%', top:'28.5%'},
  {id:29, left:'62%', top:'24%'},
  {id:30, left:'62%', top:'19%'},
  {id:31, left:'62%', top:'14.5%'},
  {id:32, left:'62%', top:'10%'},
  {id:33, left:'62%', top:'0.25%'},
  {id:34, left:'45%', top:'0.25%'},
  {id:35, left:'34%', top:'0.25%'},
  {id:36, left:'34%', top:'5%'},
  {id:37, left:'34%', top:'10%'},
  {id:38, left:'34%', top:'14.5%'},
  {id:39, left:'34%', top:'19%'},
  {id:40, left:'34%', top:'24%'},
  {id:41, left:'34%', top:'28.5%'},
  {id:42, left:'35%', top:'33%'},
  {id:43, left:'33%', top:'36%'},
  {id:44, left:'28.5%', top:'34%'},
  {id:45, left:'24%', top:'34%'},
  {id:46, left:'19%', top:'34%'},
  {id:47, left:'14.5%', top:'34%'},
  {id:48, left:'10%', top:'34%'},
  {id:49, left:'5%', top:'34%'},
  {id:50, left:'0.25%', top:'34%'},
  {id:51, left:'0.25%', top:'45%'},
  {id:52, left:'0.25%', top:'62%'},
  {id:53, left:'5%', top:'62%'},
  {id:54, left:'10%', top:'62%'},
  {id:55, left:'14.5%', top:'62%'},
  {id:56, left:'19%', top:'62%'},
  {id:57, left:'24%', top:'62%'},
  {id:58, left:'28.5%', top:'62%'},
  {id:59, left:'33%', top:'60%'},
  {id:60, left:'35%', top:'63%'},
  {id:61, left:'34%', top:'68%'},
  {id:62, left:'34%', top:'72.5%'},
  {id:63, left:'34%', top:'77%'},
  {id:64, left:'34%', top:'82%'},
  {id:65, left:'34%', top:'86.6%'},
  {id:66, left:'34%', top:'91%'},
  {id:67, left:'34%', top:'96%'},
  {id:68, left:'0%', top:'0%'},


]

function Partida() {
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
    return () => clearInterval(intervalId);
  }, [isPlaying]);


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

  return (  
    
    <div class="all">
      <div class="lamesa">
      <div class="ficha1"></div>
      <div class="ficha2"></div>
      <div class="ficha3"></div>
      <div class="ficha4"></div>
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

        <div class="rojoe">
          <div class="fichab1"></div>
          <div class="fichab2"></div>
          <div class="fichab3"></div>
          <div class="fichab4"></div>
        </div>
        <div class="amarilloe">
        <div class="fichac1"></div>
        <div class="fichac2"></div>
        <div class="fichac3"></div>
        <div class="fichac4"></div>
        </div>
        <div class="verdee">
          <div class="fichad1"></div>
          <div class="fichad2"></div>
          <div class="fichad3"></div>
          <div class="fichad4"></div>          
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
      <button class="button-partida" onClick={onClick} disabled={isPlaying}>
        Tirar dado
      </button>
      {/* <p>Numero obtenido: {currentPhotoIndex+1}</p> */}
      {/* <button class="fichaRoja"></button> */}
      {/* <button class="fichaAzul"></button>
      <button class="fichaVerde"></button>
      <button class="fichaAmarilla"></button> */}
      
    </div>
  );
}
export default Partida;