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
    
    <div>
      <div class="containerPartida">
      <img src="../imagenes/tablero/tablero.png"/>
      </div>
      <div className="partidaDado">
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
      <button class="fichaRoja"></button>
      {/* <button class="fichaAzul"></button>
      <button class="fichaVerde"></button>
      <button class="fichaAmarilla"></button> */}
    </div>
  );

}
export default Partida;