import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../styles/Principal.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Button, Modal } from 'react-bootstrap';
import tablero from "../imagenes/tablero/tablero.png";
import tablero1 from "../imagenes/tablero/tablero_Halloween.png";
import tablero2 from "../imagenes/tablero/tablero_Navidad.png";
import ficha1 from "../imagenes/tablero/ficha_Halloween.png";
import ficha2 from "../imagenes/tablero/ficha_Navidad.png";
import tablero11 from "../imagenes/tablero/tablero_Halloween_NEGRO.png";
import tablero21 from "../imagenes/tablero/tablero_Navidad_NEGRO.png";
import ficha11 from "../imagenes/tablero/Ficha_Halloween_Negro.png";
import ficha21 from "../imagenes/tablero/Ficha_navidad_Negro.png";
import cruz from "../imagenes/iconos/cruz.png";
import tick from "../imagenes/iconos/tick.png";


function Principal(){
    const [estadisticasjugador, setestadisticasjugador] = useState('');
    const navigate = useNavigate();
    const [mostrarPartidas, setMostrarPartidas] = useState(false);
    const [ShowModalSeguroBaja, setShowModalSeguroBaja] = useState(false);
    const [monedas, setmonedas] = useState(0);
    const cookies= new Cookies();
    const idUsuario = cookies.get('idUsuario');
    const [mostrar, setMostrar]=useState(false);
    const [mostablero, setTablero]=useState(false);
    const [mostablero1, setTablero1]=useState(false);
    const [mostablero2, setTablero2]=useState(false);
    const [mosfich, setFich]=useState(false);
    const [mosfich1, setFich1]=useState(false);
    const [mosfich2, setFich2]=useState(false);
    const obtenidos = Array(4).fill(false);
    const [objetos, setTiend] = useState([]);

    useEffect(() => {
      async function buscarestadisticas() {
        await axios.get("https://lamesa-backend.azurewebsites.net/usuario/estadisticas/"+idUsuario)
        .then ( response => {
          console.log("estadisticas: "+response.data)
          setestadisticasjugador(response.data);
        })
      }
      buscarestadisticas(); 
      // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //   async function asignartableropordefecto() {
    //     await axios.post("https://lamesa-backend.azurewebsites.net/usuario/activar", {usuario: idUsuario,producto: 1})
    //     .then ( response => {
    //       console.log("tablero asignado ",response.data)
    //     })
    //   }
    //   asignartableropordefecto(); 
    //   // eslint-disable-next-line
    // }, []);

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

    async function probarReconexion(){
      await axios.post("https://lamesa-backend.azurewebsites.net/partida/reconectar/"+idUsuario) 
      .then ( response => {
        console.log("RECONEXION: ",response.data);
        if(response.data === ""){
          setMostrarPartidas(true);
        }
        else{
          let id_part = response.data.id;
          let col = response.data.color;
          let jug = response.data.jugadores;
          let tipo = "PRIVADA";
          let num_fichas = response.data.cf;
          console.log("configuracion de las fichas: "+num_fichas);
          navigate(process.env.PUBLIC_URL+'/partida', { state: { id_part,col,jug,tipo,num_fichas } });
        }
      }) 
    }
    useEffect(()=>{
      async function consultarActivo(yo){
        //sacar que producto tiene activo

        
      }
      consultarActivo(idUsuario)
    }, [idUsuario])
  
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
  
    const handleClick = () => {
      probarReconexion();
    };

    const handleClick1 = () => {
        navigate(process.env.PUBLIC_URL+'/partidaPublica');
    };
    
    const handleClick2 = () => {
      navigate(process.env.PUBLIC_URL+'/partidaPrivada');
    };
    const handleClick3 = () => {
      navigate(process.env.PUBLIC_URL+'/datosPersonales');
    };
    const handleClick4 = () => {
      navigate(process.env.PUBLIC_URL+'/amigos');
    };
    const handleClick5 = () => {
      navigate(process.env.PUBLIC_URL+'/torneos');
    };
    const handleClick6 = () => {
      navigate(process.env.PUBLIC_URL+'/rankings');
    };
    const handleClick7 = () => {
      navigate(process.env.PUBLIC_URL+'/tienda');
    };
    const handleClick8 = () => {
      if(mostrar){
        setMostrar(false);
      }
      else {  setMostrar(true);}
      
    };
    async function darbaja(){
      await axios.post("https://lamesa-backend.azurewebsites.net/usuario/eliminar/"+idUsuario) 
      .then ( response => {
        navigate(process.env.PUBLIC_URL+'/');
      }) 
      .catch(error => {
        setShowModalSeguroBaja(false);
      })  
    }
    function id0(){
      setTablero(true);
      setTablero1(false);
      setTablero2(false);
      //setear como tablero 1 en uso
    }
     function id1(){
      setTablero(false);
      setTablero1(true);
      setTablero2(false);

     }
     function id2(){

      setTablero(false);
      setTablero1(false);
      setTablero2(true);
    }
     function id3(){
     setFich(true);
     setFich1(false);
     setFich2(false);
    }
     function id4(){
      setFich(false);
      setFich1(true);
      setFich2(false);
    }
     function id5(){
      setFich(false);
      setFich1(false);
      setFich2(true);
    }

    return (
        <>       
          <div class="monedasJugador" data-number={monedas}></div>
          <h1>BIENVENIDO {cookies.get('nombreUsuario')}</h1>
          <br></br><br></br><br></br><br></br><br></br>
          {mostrar?
            <div className="inv">
              <div className="tableros">
        
                <img className="btn" src={tablero} alt="" onClick={id0}/>
                { mostablero?(
                    <img className="tick" src={tick} alt="" />
                    ):  (<img className="no-tick" src={tick} alt="" />)
                }

                {!obtenidos[0] ? <img className="btn11" src={tablero11} alt="" /> : <img className="btn" src={tablero1} alt="" onClick={id1}/>}
                { mostablero1?(
                    <img className="tick1" src={tick} alt="" />
                    ):  (<img className="no-tick" src={tick} alt="" />)
                }
                {!obtenidos[1] ? <img className="btn11" src={tablero21} alt="" /> : <img className="btn" src={tablero2} alt="" onClick={id2}/>}
                { mostablero2?(
                    <img className="tick2" src={tick} alt="" />
                    ):  (<img className="no-tick" src={tick} alt="" />)
                }
              </div>
              <div className="fichas">

                <img className="btn21" src={ficha1} alt="" onClick={id3}/>
                { mosfich?(
                    <img className="tick3" src={tick} alt="" />
                    ):  (<img className="no-tick" src={tick} alt="" />)
                }
  
                {!obtenidos[2] ? <img className="btn121" src={ficha21} alt="" /> : <img className="btn21" src={ficha2} alt="" onClick={id4}/>}
                { mosfich1?(
                    <img className="tick4" src={tick} alt="" />
                    ):  (<img className="no-tick" src={tick} alt="" />)
                }                
                {!obtenidos[3] ? <img className="btn121" src={ficha11} alt="" /> : <img className="btn21" src={ficha1} alt="" onClick={id5}/>}
                { mosfich2?(
                    <img className="tick5" src={tick} alt="" />
                    ):  (<img className="no-tick" src={tick} alt="" />)
                }                
              </div>
           
              <div className="cruzcont"><img className="cruz" src={cruz} alt="" onClick={handleClick8}/></div>
               
            </div>
            : <div></div> }
          <button className="botonDatosPersonales" onClick={handleClick3}>Datos personales</button>         
          {mostrarPartidas ? (
              <div className="botones">
                <button className="botonJugarPublica" onClick={handleClick1}>
                  Partida Pública
                </button>
                <button className="botonJugarPrivada" onClick={handleClick2}>
                  Partida Privada
                </button>
              </div>
            ) : (
              <div>
                <button className="botonJugar" onClick={handleClick}>
                  Jugar
                </button>
              </div>
            )}
          <button className="botonAmigos" onClick={handleClick4}>Amigos</button>
          <button className="botontorneos" onClick={handleClick5}>Torneos</button>
          <button className="botonrankings" onClick={handleClick6}>Rankings</button>
          <button className="botonbaja" onClick={() => setShowModalSeguroBaja(true)}>Darme de baja</button>
          <button className="botontienda" onClick={handleClick7}>Tienda</button>
          <button className="botonInventario" onClick={handleClick8}>Inventario</button>
          <div className="estadisticas">
            <p className="tituloEstadisticas">Estadísticas personales</p>
            <p className="subtituloEstadisticas">Fichas comidas:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.mediaComidas}</p>
            <br></br>
            <p className="subtituloEstadisticas">Fichas en meta:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.mediaEnMeta}</p>
            <br></br>
            <p className="subtituloEstadisticas">Partidas jugadas:&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.pjugadas}</p>
            <br></br>
            <p className="subtituloEstadisticas">Partidas ganadas:&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.pganadas}</p>
            <br></br>
            <p className="subtituloEstadisticas">Torneos jugados:&nbsp;&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.tjugados}</p>
            <br></br>
            <p className="subtituloEstadisticas">Torneos ganados:&nbsp;</p>
            <p className="resultadoEstadisticas">{estadisticasjugador.tganados}</p>
          </div>
          {ShowModalSeguroBaja && <div className="fondo-negro"></div>}
          <Modal 
            show={ShowModalSeguroBaja} 
            onHide={() => setShowModalSeguroBaja(false)} 
            centered
            className="custom-modal-segurosalir"
        >
        <Modal.Header>
        <Button className="cerrarModal" onClick={() => {
            setShowModalSeguroBaja(false);
        }}>X</Button>
        <Modal.Title className="modalTitle">¿Seguro que quieres darte de baja?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="button-container">
                <button className="siboton" onClick={() => darbaja()}>Sí</button>
                <button className="noboton" onClick={() => setShowModalSeguroBaja(false)} style={{ marginRight: "5%" }}>No</button>
            </div>
        </Modal.Body>
        </Modal>
        </>
      );
      
    
}

export default Principal;