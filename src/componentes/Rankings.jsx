import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../styles/Rankings.css";
import home from "../imagenes/iconos/home.svg"

function Rankings(){
  const [jugadoresrank, setjugadoresrank] = useState([]);

  useEffect(() => {
    async function buscarjugadores() {
      const response = await axios.get("https://lamesa-backend.azurewebsites.net/usuario/ranking");
      const jug = response.data;
      const jugadores = [];
      jug.forEach(jugador => {     
        jugadores.push(jugador);
      });
      setjugadoresrank(jugadores);
    }
    buscarjugadores(); 
  }, []);

    return(
      <>
        <div>
          <div className="back5">
            <div class="breadcrumb">
              <div class="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
              <div class="breadcrumb-item">&gt;</div>
              <div class="breadcrumb-item">Rankings</div>
            </div>
          </div>             
        </div>
        <h1>RANKING</h1>
        {jugadoresrank.map((jugador, index) => (
          <div key={index}>
            <table>
            <tr>
              <td>{jugador.username}</td>
              <td>{jugador.mediaComidas}</td>
              <td>{jugador.mediaEnMeta}</td>
              <td>{jugador.pjugadas}</td>
              <td>{jugador.pjganadas}</td>
            </tr>
            </table>
          </div>
        ))}
      </>
    );
}

export default Rankings;