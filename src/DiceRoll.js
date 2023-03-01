import React, { useState, useEffect } from "react";

import cara1 from './caras/uno.PNG';
import cara2 from './caras/dos.PNG';
import cara3 from './caras/tres.PNG';
import cara4 from './caras/cuatro.PNG';
import cara5 from './caras/cinco.PNG';
import cara6 from './caras/seis.PNG';

const photos = [
  { id:1, name: "Foto 1", url: cara1 },
  { id:2, name: "Foto 2", url: cara2 },
  { id:3, name: "Foto 3", url: cara3 },
  { id:4, name: "Foto 4", url: cara4 },
  { id:5, name: "Foto 5", url: cara5 },
  { id:6, name: "Foto 6", url: cara6 },
];

//Prueba1
function DiceRoll() {
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

  return (
    <div>
      {photos.map((photo, index) => (
        <img
          key={photo.name}
          src={photo.url}
          alt={photo.name}
          style={{ display: index === currentPhotoIndex ? "block" : "none" }}
        />
      ))
      }
      <button onClick={handleStart} disabled={isPlaying}>
        Tirar dado
      </button>
      <p>Numero obtenido: {currentPhotoIndex+1}</p>
    </div>
  );

}

export default DiceRoll;
