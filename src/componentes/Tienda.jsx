import "../styles/Tienda.css";
import home from "../imagenes/iconos/home.svg"
//import axios from "axios";
import React, {} from "react";


function Tienda(){

  //const [cosas, setcosas] = useState([]);


  
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
          <div className="compra">
            <div className="container">
              <button className="botn1">
                Tablero de Navidad
              </button>
              </div>
              <button className="botn">
                Tablero de Halloween
              </button>
              <button className="botn">
                Ficha de Navidad
              </button>
              <button className="botn">
                Ficha de Halloween
              </button>

        


          </div>
      </div>
    );
}

export default Tienda;