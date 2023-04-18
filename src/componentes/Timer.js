import React, { useState } from "react";

function Timer({ timeLimit, onTimeUp }) {
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;
    const TIME_LIMIT = timeLimit;
    const COLOR_CODES = {
        info: {
          color: "green"
        },
        warning: {
          color: "orange",
          threshold: WARNING_THRESHOLD
        },
        alert: {
          color: "red",
          threshold: ALERT_THRESHOLD
        }
      };
      const [timerStarted, setTimerStarted] = useState(false);
      let timePassed = 0;
      let timeLeft = TIME_LIMIT;
      let timerInterval = null;
      let remainingPathColor = COLOR_CODES.info.color;
      startTimer();

      function onTimesUp() {
        clearInterval(timerInterval);
        onTimeUp();
      }

      function startTimer() {
        if (!timerStarted) {
          setTimerStarted(true);
          timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed; 
            let baseTimerLabel = document.getElementById("base-timer-label");
            if (baseTimerLabel !== null) {
              baseTimerLabel.innerHTML = formatTime(timeLeft);
            }          
            setCircleDasharray();
            setRemainingPathColor(timeLeft);
        
            if (timeLeft === 0) {
              onTimesUp();
            }
          }, 1000);
        }
      }
      
      function formatTime(time) {
        let seconds = time % 60;     
        return `${seconds}`;
      }
      
      function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        const remainingPathColorElement = document.getElementById(
          "base-timer-path-remaining"
        );
        if (remainingPathColorElement) {
          if (timeLeft <= alert.threshold) {
            remainingPathColorElement.classList.remove(warning.color);
            remainingPathColorElement.classList.add(alert.color);
          } else if (timeLeft <= warning.threshold) {
            remainingPathColorElement.classList.remove(info.color);
            remainingPathColorElement.classList.add(warning.color);
          }
        }
      }
      
      function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
      }
      
      function setCircleDasharray() {
        let baseTimerPathRemaining = document.getElementById("base-timer-path-remaining");
        if (baseTimerPathRemaining !== null) {
          const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
          ).toFixed(0)} 283`;
          baseTimerPathRemaining.setAttribute("stroke-dasharray", circleDasharray);
        }
      }

  return (
    
    <div>
        <>
          <p className="textoTiempo">Tiempo restante:</p>
          <div className="base-timer">
          <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g className="base-timer__circle">
              <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
              <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                className={`base-timer__path-remaining ${remainingPathColor}`}
                d="
                  M 50, 50
                  m -45, 0
                  a 45,45 0 1,0 90,0
                  a 45,45 0 1,0 -90,0
                "
              ></path>
            </g>
          </svg>
          <span id="base-timer-label" className="base-timer__label">{formatTime(timeLeft)}</span>
          </div>
      </>
    </div>
   
  );
}
export default Timer;