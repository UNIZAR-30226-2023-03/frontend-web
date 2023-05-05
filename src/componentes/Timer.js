import React, { useRef, useState } from "react";
//import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "../styles/Timer.css";

const RenderTime = ({ remainingTime }) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

function Timer({ onTimeUp}) {
  const handleTimerComplete = () => {
    onTimeUp();
  };

  return (
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={25}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[15, 9, 5, 0]}
          onComplete={handleTimerComplete} 
        >
        {RenderTime}
        </CountdownCircleTimer>
      </div>
  );
}
export default Timer;
//const rootElement = document.getElementById("root");
//ReactDOM.render(<App />, rootElement);
