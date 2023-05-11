import "../styles/Tienda.css";
import home from "../imagenes/iconos/home.svg"
import axios from "axios";
import React, {useEffect, useState} from "react";
import Cookies from 'universal-cookie';


function Tienda(){
  const cookies= new Cookies();
  const idUsuario = cookies.get('idUsuario');
  const [objetos, setTiend] = useState([]);
  const obtenidos = Array(4).fill(false);
  const [monedas, setmonedas] = useState(0);
  useEffect(() => {
    async function buscarmonedas() {
      await axios.get("https://lamesa-backend.azurewebsites.net/usuario/monedas/"+idUsuario)
      .then ( response => {
        setmonedas(response.data);
      })
    }
    buscarmonedas(); 
    // eslint-disable-next-line
  }, []);
  useEffect(()=>{
    async function consultarTienda(yo){
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/productos/"+yo);  
      const objetos = response.data;
      console.log("objetos",response.data);
      const tiend = [];
        objetos.forEach(objeto => {
          tiend.push(objeto); 
        });
        setTiend(tiend);
    }
    consultarTienda(idUsuario)
  }, [idUsuario])


  useEffect(()=>{
    async function recorrerVector(todos){
      todos.forEach(objet=>{
        if(objet==="1"){
          obtenidos[0]=true;
        }
        else if (objet==="2"){
          obtenidos[1]=true;
        }
        else if (objet==="3"){
          obtenidos[2]=true;
        }
        else if (objet==="4"){
          obtenidos[3]=true;
        }
        
      });
    }
    recorrerVector(objetos)
  }, [objetos,obtenidos])
  async function id0() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"1"});
    console.log(response.data)
    console.log("comprado tablero1");
    window.location.reload(); 
  }
  async function id1() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"2"});
    console.log(response.data)
    console.log("comprado tablero2");
    window.location.reload(); 
  }
  async function id2() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"3"});
    console.log(response.data)
    console.log("comprado ficha1");
    window.location.reload(); 
  }
  async function id3() {
    const response =await axios.post("https://lamesa-backend.azurewebsites.net/tienda/comprar", {usuario: idUsuario,producto:"4"});
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
            <div className="bb">
              <button className={obtenidos[0] ? "botn-no": "botn"} onClick={id0}></button>
              <p className="asd">Despripcion del producto</p>
            </div>
            <div className="bb">
              <button className={obtenidos[1] ? "botn-no1": "botn1"}  onClick={id1}></button>
              <p className="asd">Despripcion del producto</p>
            </div>
            <div className="bb">
              <button className={obtenidos[2] ? "botn-no2": "botn2"}  onClick={id2}></button>
              <p className="asd">Despripcion del producto</p>
              </div>
            <div className="bb">
              <button className={obtenidos[3] ? "botn-no3": "botn3"}  onClick={id3}></button>
              <p className="asd">Despripcion del producto</p>
              </div>
          </div>
      </div>
    );
}

export default Tienda;