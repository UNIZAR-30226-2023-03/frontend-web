import "../styles/Tienda.css";
import home from "../imagenes/iconos/home.svg"
//import axios from "axios";
import React, {useState} from "react";


function Tienda(){

  const [tableros, setMostrarTableros]=useState(true)
  const [fichas, setMostrarFichas]=useState(false)
  //const [cosas, setcosas] = useState([]);


  function handleClick(){
    if(tableros){
      setMostrarTableros(false);
    }
    else{
      setMostrarTableros(true);
      setMostrarFichas(false);
    }
  }
  function handleClick1(){
    if(fichas){
      setMostrarFichas(false);
    }
    else{
      setMostrarFichas(true);
      setMostrarTableros(false);
    }
  }
  // useEffect(() => {
  //   async function obtenerTienda() {
  //     await axios.get("https://lamesa-backend.azurewebsites.net/tienda")
  //     const torneosactivos = [];
  //     torneos.forEach(torneo => {
  //       if (torneo.estado ==="ESPERANDO_JUGADORES") {
  //         torneosactivos.push(torneo);
  //         console.log("torneo : "+torneo.nombre);
  //       }
  //     });
  //     settorneosActivos(torneosactivos);

      
  //   }
  //   obtenerTienda(); 
  // }, []);

    return(
      
      <div>
          <div className="back7">
              <div className="breadcrumb">
              <div className="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div className="breadcrumb-item">&gt;</div>
              <div className="breadcrumb-item">Tienda</div>
              </div>
          </div>
          <div>
            <button  onClick={handleClick}>Tableros</button>
            <button  onClick={handleClick1}>Fichas</button>
          </div>
        {/* .map((torneo, index) => (
          <div key={index}className="torneosdisponibles">
            <table>
            <tr>
              <td colspan="3" className="nombre-torneo">{torneo.nombre}</td>
              <td rowspan="2"><button onClick={() => apuntarseTorneo(torneo.id,cookies.get('idUsuario'),navigate)}>Apuntarse</button></td>
            </tr>
            <tr>
              <td>{torneo.precioEntrada}</td>
              <td>{torneo.configBarreras}</td>
              <td>{torneo.configFichas}</td>
            </tr>
            </table>
          </div>
        ))} */}
      </div>
    );
}

export default Tienda;