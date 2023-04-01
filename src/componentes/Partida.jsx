import React, { useState, useEffect } from "react";
import "../styles/Partida.css";
import Timer from './Timer';



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
  {id:1, left:'62%', top:'96%',numfichas:0},
  {id:2, left:'62%', top:'91%',numfichas:0},
  {id:3, left:'62%', top:'86.6%',numfichas:0},
  {id:4, left:'62%', top:'82%',numfichas:0},
  {id:5, left:'62%', top:'77%',numfichas:0},
  {id:6, left:'62%', top:'72.5%',numfichas:0},
  {id:7, left:'62%', top:'63%',numfichas:0},
  {id:8, left:'60.7%', top:'63%',numfichas:0},
  {id:9, left:'63%', top:'60%',numfichas:0},
  {id:10, left:'67.5%', top:'62%',numfichas:0},
  {id:11, left:'72.5%', top:'62%',numfichas:0},
  {id:12, left:'77%', top:'62%',numfichas:0},
  {id:13, left:'81.5%', top:'62%',numfichas:0},
  {id:14, left:'86.5%', top:'62%',numfichas:0},
  {id:15, left:'91%', top:'62%',numfichas:0},
  {id:16, left:'95.7%', top:'62%',numfichas:0},
  {id:17, left:'95.7%', top:'45%',numfichas:0},
  {id:18, left:'95.7%', top:'34%',numfichas:0},
  {id:19, left:'91%', top:'34%',numfichas:0},
  {id:20, left:'86.5%', top:'34%',numfichas:0},
  {id:21, left:'81.5%', top:'34%',numfichas:0},
  {id:22, left:'77%', top:'34%',numfichas:0},
  {id:23, left:'72.5%', top:'34%',numfichas:0},
  {id:24, left:'67.5%', top:'34%',numfichas:0},
  {id:25, left:'63%', top:'36%',numfichas:0},
  {id:26, left:'61%', top:'33%',numfichas:0},
  {id:27, left:'62%', top:'28.5%',numfichas:0},
  {id:28, left:'62%', top:'24%',numfichas:0},
  {id:29, left:'62%', top:'19%',numfichas:0},
  {id:30, left:'62%', top:'14.5%',numfichas:0},
  {id:31, left:'62%', top:'10%',numfichas:0},
  {id:32, left:'62%', top:'5%',numfichas:0},
  {id:33, left:'62%', top:'0.25%',numfichas:0},
  {id:34, left:'45%', top:'0.25%',numfichas:0},
  {id:35, left:'34%', top:'0.25%',numfichas:0},
  {id:36, left:'34%', top:'5%',numfichas:0},
  {id:37, left:'34%', top:'10%',numfichas:0},
  {id:38, left:'34%', top:'14.5%',numfichas:0},
  {id:39, left:'34%', top:'19%',numfichas:0},
  {id:40, left:'34%', top:'24%',numfichas:0},
  {id:41, left:'34%', top:'28.5%',numfichas:0},
  {id:42, left:'35%', top:'33%',numfichas:0},
  {id:43, left:'33%', top:'36%',numfichas:0},
  {id:44, left:'28.5%', top:'34%',numfichas:0},
  {id:45, left:'24%', top:'34%',numfichas:0},
  {id:46, left:'19%', top:'34%',numfichas:0},
  {id:47, left:'14.5%', top:'34%',numfichas:0},
  {id:48, left:'10%', top:'34%',numfichas:0},
  {id:49, left:'5%', top:'34%',numfichas:0},
  {id:50, left:'0.25%', top:'34%',numfichas:0},
  {id:51, left:'0.25%', top:'45%',numfichas:0},
  {id:52, left:'0.25%', top:'62%',numfichas:0},
  {id:53, left:'5%', top:'62%',numfichas:0},
  {id:54, left:'10%', top:'62%',numfichas:0},
  {id:55, left:'14.5%', top:'62%',numfichas:0},
  {id:56, left:'19%', top:'62%',numfichas:0},
  {id:57, left:'24%', top:'62%',numfichas:0},
  {id:58, left:'28.5%', top:'62%',numfichas:0},
  {id:59, left:'33%', top:'60%',numfichas:0},
  {id:60, left:'35%', top:'63%',numfichas:0},
  {id:61, left:'34%', top:'68%',numfichas:0},
  {id:62, left:'34%', top:'72.5%',numfichas:0},
  {id:63, left:'34%', top:'77%',numfichas:0},
  {id:64, left:'34%', top:'82%',numfichas:0},
  {id:65, left:'34%', top:'86.6%',numfichas:0},
  {id:66, left:'34%', top:'91%',numfichas:0},
  {id:67, left:'34%', top:'96%',numfichas:0},
  {id:68, left:'45%', top:'96%',numfichas:0},


  //amarillo
  {id:69, left:'51%', top:'91%',numfichas:0},
  {id:70, left:'51%', top:'86.5%',numfichas:0},
  {id:71, left:'51%', top:'82%',numfichas:0},
  {id:72, left:'51%', top:'77%',numfichas:0},
  {id:73, left:'51%', top:'72.5%',numfichas:0},
  {id:74, left:'51%', top:'68%',numfichas:0},
  {id:75, left:'51%', top:'63%',numfichas:0},
  //amarillo IZQ
  {id:'69-2', left:'45%', top:'91%',numfichas:0},
  {id:'70-2', left:'45%', top:'86.5%',numfichas:0},
  {id:'71-2', left:'45%', top:'82%',numfichas:0},
  {id:'72-2', left:'45%', top:'77%',numfichas:0},
  {id:'73-2', left:'45%', top:'72.5%',numfichas:0},
  {id:'74-2', left:'45%', top:'68%',numfichas:0},
  {id:'75-2', left:'45%', top:'63%',numfichas:0},

  //azul
  {id:76, left:'45%', top:'45%',numfichas:0},
  {id:77, left:'86.5%', top:'45%',numfichas:0},
  {id:78, left:'81.5%', top:'45%',numfichas:0},
  {id:79, left:'77%', top:'45%',numfichas:0},
  {id:80, left:'72.5%', top:'45%',numfichas:0},
  {id:81, left:'67.5%', top:'45%',numfichas:0},
  {id:82, left:'63%', top:'45%',numfichas:0},

  //azul IZQ
  {id:'76-2', left:'91%', top:'51%',numfichas:0},
  {id:'77-2', left:'86.5%', top:'51%',numfichas:0},
  {id:'78-2', left:'81.5%', top:'51%',numfichas:0},
  {id:'79-2', left:'77%', top:'51%',numfichas:0},
  {id:'80-2', left:'72.5%', top:'51%',numfichas:0},
  {id:'81-2', left:'67.5%', top:'51%',numfichas:0},
  {id:'82-2', left:'63%', top:'51%',numfichas:0},

  //rojo
  {id:83, left:'51%', top:'5%',numfichas:0},
  {id:84, left:'51%', top:'10%',numfichas:0},
  {id:85, left:'51%', top:'14.5%',numfichas:0},
  {id:86, left:'51%', top:'19%',numfichas:0},
  {id:87, left:'51%', top:'24%',numfichas:0},
  {id:88, left:'51%', top:'28.5%',numfichas:0},
  {id:89, left:'51%', top:'33%',numfichas:0},
  
  //rojo iZQ
  {id:'83-2', left:'45%', top:'5%',numfichas:0},
  {id:'84-2', left:'45%', top:'10%',numfichas:0},
  {id:'85-2', left:'45%', top:'14.5%',numfichas:0},
  {id:'86-2', left:'45%', top:'19%',numfichas:0},
  {id:'87-2', left:'45%', top:'24%',numfichas:0},
  {id:'88-2', left:'45%', top:'28.5%',numfichas:0},
  {id:'89-2', left:'45%', top:'33%',numfichas:0},

  //verde
  {id:90, left:'5%', top:'45%',numfichas:0},
  {id:91, left:'10%', top:'45%',numfichas:0},
  {id:92, left:'14.5%', top:'45%',numfichas:0},
  {id:93, left:'19%', top:'45%',numfichas:0},
  {id:94, left:'24%', top:'45%',numfichas:0},
  {id:95, left:'28.5%', top:'45%',numfichas:0},
  {id:96, left:'33%', top:'45%',numfichas:0},
  
  //verde iZQ
  {id:'90-2', left:'5%', top:'51%',numfichas:0},
  {id:'91-2', left:'10%', top:'51%',numfichas:0},
  {id:'92-2', left:'14.5%', top:'51%',numfichas:0},
  {id:'93-2', left:'19%', top:'51%',numfichas:0},
  {id:'94-2', left:'24%', top:'51%',numfichas:0},
  {id:'95-2', left:'28.5%', top:'51%',numfichas:0},
  {id:'96-2', left:'33%', top:'51%',numfichas:0},



  {id:'1-2', left:'56%', top:'96%', numfichas:0},
  {id:'2-2', left:'56%', top:'91%', numfichas:0},
  {id:'3-2', left:'56%', top:'86.6%', numfichas:0},
  {id:'4-2', left:'56%', top:'82%', numfichas:0},
  {id:'5-2', left:'56%', top:'77%', numfichas:0},
  {id:'6-2', left:'56%', top:'72.5%', numfichas:0},
  {id:'7-2', left:'56%', top:'68%', numfichas:0},
  {id:'8-2', left:'56%', top:'63%', numfichas:0},
  {id:'9-2', left:'63%', top:'55.7%', numfichas:0},
  {id:'10-2', left:'67.5%', top:'57%', numfichas:0},
  {id:'11-2', left:'72.5%', top:'57%', numfichas:0},
  {id:'12-2', left:'77%', top:'57%', numfichas:0},
  {id:'13-2', left:'81.5%', top:'57%', numfichas:0},
  {id:'14-2', left:'86.5%', top:'57%', numfichas:0},
  {id:'15-2', left:'91%', top:'57%', numfichas:0},
  {id:'16-2', left:'95.7%', top:'57%', numfichas:0},
  {id:'17-2', left:'95.7%', top:'51%', numfichas:0},
  {id:'18-2', left:'95.7%', top:'39%', numfichas:0},
  {id:'19-2', left:'91%', top:'39%', numfichas:0},
  {id:'20-2', left:'86.5%', top:'39%', numfichas:0},
  {id:'21-2', left:'81.5%', top:'39%', numfichas:0},
  {id:'22-2', left:'77%', top:'39%', numfichas:0},
  {id:'23-2', left:'72.5%', top:'39%', numfichas:0},
  {id:'24-2', left:'67.5%', top:'39%', numfichas:0},
  {id:'25-2', left:'63%', top:'40.5%', numfichas:0},
  {id:'26-2', left:'56%', top:'33%', numfichas:0},
  {id:'27-2', left:'56%', top:'28.5%', numfichas:0},
  {id:'28-2', left:'56%', top:'24%', numfichas:0},
  {id:'29-2', left:'56%', top:'19%', numfichas:0},
  {id:'30-2', left:'56%', top:'14.5%', numfichas:0},
  {id:'31-2', left:'56%', top:'10%', numfichas:0},
  {id:'32-2', left:'56%', top:'5%', numfichas:0},
  {id:'33-2', left:'56%', top:'0.25%', numfichas:0},
  {id:'34-2', left:'51%', top:'0.25%', numfichas:0},
  {id:'35-2', left:'39%', top:'0.25%', numfichas:0},
  {id:'36-2', left:'39%', top:'5%', numfichas:0},
  {id:'37-2', left:'39%', top:'10%', numfichas:0},
  {id:'38-2', left:'39%', top:'14.5%', numfichas:0},
  {id:'39-2', left:'39%', top:'19%', numfichas:0},
  {id:'40-2', left:'39%', top:'24%', numfichas:0},
  {id:'41-2', left:'39%', top:'28.5%', numfichas:0},
  {id:'42-2', left:'40%', top:'33%', numfichas:0},
  {id:'43-2', left:'33%', top:'40.3%', numfichas:0},
  {id:'44-2', left:'28.5%', top:'39%', numfichas:0},
  {id:'45-2', left:'24%', top:'39%', numfichas:0},
  {id:'46-2', left:'19%', top:'39%', numfichas:0},
  {id:'47-2', left:'14.5%', top:'39%', numfichas:0},
  {id:'48-2', left:'10%', top:'39%', numfichas:0},
  {id:'49-2', left:'5%', top:'39%', numfichas:0},
  {id:'50-2', left:'0.25%', top:'39%', numfichas:0},
  {id:'51-2', left:'0.25%', top:'51%', numfichas:0},
  {id:'52-2', left:'0.25%', top:'57%', numfichas:0},
  {id:'53-2', left:'5%', top:'57%', numfichas:0},
  {id:'54-2', left:'10%', top:'57%', numfichas:0},
  {id:'55-2', left:'14.5%', top:'57%', numfichas:0},
  {id:'56-2', left:'19%', top:'57%', numfichas:0},
  {id:'57-2', left:'24%', top:'57%', numfichas:0},
  {id:'58-2', left:'28.5%', top:'57%', numfichas:0},
  {id:'59-2', left:'33%', top:'55.5%', numfichas:0},
  {id:'60-2', left:'40%', top:'63%', numfichas:0},
  {id:'61-2', left:'39%', top:'68%', numfichas:0},
  {id:'62-2', left:'39%', top:'72.5%', numfichas:0},
  {id:'63-2', left:'39%', top:'77%', numfichas:0},
  {id:'64-2', left:'39%', top:'82%', numfichas:0},
  {id:'65-2', left:'39%', top:'86.6%', numfichas:0},
  {id:'66-2', left:'39%', top:'91%', numfichas:0},
  {id:'67-2', left:'39%', top:'96%', numfichas:0},
  {id:'68-2', left:'51%', top:'96%', numfichas:0}
]

function Partida() {
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  //const [numeroObtenidoDado, setnumeroObtenidoDado] = useState(0);

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
      const ficha1 = document.querySelector('.ficha1');
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

//"..//imagenes/iconos/lamesa.png"

  return (  
    
    <div class="all">
      <div class="lamesa">
        <div class="icono"></div>
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
      {/* <p>Numero obtenido: {currentPhotoIndex+1}</p> */}
      {/* <button class="fichaRoja"></button> */}
      {/* <button class="fichaAzul"></button>
      <button class="fichaVerde"></button>
      <button class="fichaAmarilla"></button> */}
      <Timer/>
      
    </div>
  );
}
export default Partida;