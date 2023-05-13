import "../styles/Tienda.css";
import home from "../imagenes/iconos/home.svg"
import axios from "axios";
import React, {useEffect, useState} from "react";
import Cookies from 'universal-cookie';
import tablero1 from "../imagenes/tablero/tablero_Halloween.png";
import tablero2 from "../imagenes/tablero/tablero_Navidad.png";
import ficha1 from "../imagenes/tablero/ficha_Halloween.png";
import ficha2 from "../imagenes/tablero/ficha_Navidad.png";
import tablero11 from "../imagenes/tablero/tablero_Halloween_NEGRO.png";
import tablero21 from "../imagenes/tablero/tablero_Navidad_NEGRO.png";
import ficha11 from "../imagenes/tablero/Ficha_Halloween_Negro.png";
import ficha21 from "../imagenes/tablero/Ficha_navidad_Negro.png";


function Tienda(){
  const cookies= new Cookies();
  const idUsuario = cookies.get('idUsuario');
  const [obtenidos, setobtenidos] = useState([]);
  const [monedas, setmonedas] = useState(0);
  const [precio, setPrecio] = useState([]);

  useEffect(() => {
    async function buscarmonedas() {
      await axios.get("https://lamesa-backend.azurewebsites.net/usuario/monedas/"+idUsuario)
      .then ( response => {
        setmonedas(response.data);
      })
    }
    buscarmonedas(); 
    
  }, [idUsuario]);

  useEffect(()=>{
    function recorrerVector(todos){
      const obtenidos2 = [];
      todos.forEach(objet=>{
       obtenidos2[objet]=true;        
      });
      setobtenidos(obtenidos2);
    }
    async function consultarTienda(){
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/productos/"+idUsuario);  
      const obj = response.data;
      console.log("objetos",response.data);
      const tiend = [];
      obj.forEach(objeto => {
        tiend.push(objeto.id); 
      });
      recorrerVector(tiend);
    }
    consultarTienda()
    // eslint-disable-next-line
  }, [idUsuario])

  useEffect(()=>{
    async function buscarproductos(){
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/tienda");  
      console.log("tienda",response.data);
      const precio_vect = response.data;
      const prec = [];
      precio_vect.forEach(objeto => {
        prec.push(objeto.precio); 
      });
      setPrecio(prec);
    }
    buscarproductos();
  }, [])





  async function id0() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"2"});
    console.log(response.data)
    console.log("comprado tablero1");
    window.location.reload(); 
  }
  async function id1() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"3"});
    console.log(response.data)
    console.log("comprado tablero2");
    window.location.reload(); 
  }
  async function id2() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"5"});
    console.log(response.data)
    console.log("comprado ficha1");
    window.location.reload(); 
  }
  async function id3() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"6"});
    console.log(response.data)
    console.log("comprado ficha2");
    window.location.reload();  
  }
    return(
      
      <div>
          <div class="monedasJugador1" data-number={monedas}></div>
          <div className="back7">
              <div className="breadcrumb">
              <div className="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div className="breadcrumb-item">&gt;</div>
              <div className="breadcrumb-item">Tienda</div>
              </div>
          </div>
          <div className="txt"> 
            <p>Seleccione el producto que desee comprar</p> 
          </div>
          <div className="compra">
            <div className="ass" >
              {console.log(obtenidos[2])}
              {obtenidos[2] ? <img className="btn11" src={tablero11} alt="" /> : <img className="btn" src={tablero1} alt="" onClick={id0}/>}
              <p className="asd">{precio[2]}</p>
            </div>
            <div>
              {obtenidos[3] ? <img className="btn11" src={tablero21} alt="" /> : <img className="btn" src={tablero2} alt="" onClick={id1}/>}
              <p className="asd">{precio[3]}</p>
            </div>
            <div>
              {obtenidos[5] ? <img className="btn12" src={ficha11} alt="" /> : <img className="btn1" src={ficha1} alt="" onClick={id2}/>}
              <p className="asd">{precio[5]}</p>
            </div>
            <div>
              {obtenidos[6] ? <img className="btn12" src={ficha21} alt="" /> : <img className="btn1" src={ficha2} alt="" onClick={id3}/>}
              <p className="asd">{precio[6]}</p>
            </div>   
          </div>

      </div>
    );
}

export default Tienda;