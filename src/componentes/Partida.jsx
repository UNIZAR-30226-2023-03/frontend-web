import React, { useState, useEffect } from "react";
import "../styles/Partida.css";
import { useNavigate } from 'react-router-dom';
import backgroundImage from '//imagenes/tablero/tablero.png';
import DiceRoll from '../DiceRoll';
import { photos } from '../DiceRoll';



function Partida() {
  const [diceImageUrl, setDiceImageUrl] = useState('');
  const [showDiceButton, setShowDiceButton] = useState(true);

  useEffect(() => {
    setDiceImageUrl(photos[0].url);
  }, []);

  const handleShowDiceButton = () => {
    setShowDiceButton((prevShowDiceButton) => !prevShowDiceButton);
  };

  return (
    <div className="container">
      <img className="background-image" src={backgroundImage} alt="Background" />
      {showDiceButton && (
        <div className="dice-container">
          <img className="dice-image" src={diceImageUrl} alt="Dice Roll" />
          <DiceRoll setDiceImageUrl={setDiceImageUrl} />
        </div>
      )}
      <button onClick={handleShowDiceButton}>
        {showDiceButton ? 'Ocultar dado' : 'Mostrar dado'}
      </button>
    </div>
  );
}


export default Partida;
