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
          <div className="ranking-table">
            <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Usuario</th>
                <th>Fichas comidas</th>
                <th>Fichas en meta</th>
                <th>Partidas jugadas</th>
                <th>Partidas ganadas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>jugador1</td>
                <td>4</td>
                <td>2</td>
                <td>10</td>
                <td>5</td>
              </tr>
              <tr>
                <td>2</td>
                <td>jugador2</td>
                <td>6</td>
                <td>3</td>
                <td>8</td>
                <td>4</td>
              </tr>
              <tr>
                <td>3</td>
                <td>jugador3</td>
                <td>2</td>
                <td>4</td>
                <td>12</td>
                <td>3</td>
              </tr>
            </tbody>
            </table>
          </div>
      </>
    );
}

export default Rankings;