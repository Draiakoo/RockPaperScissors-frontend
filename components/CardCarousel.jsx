"use client"

import "@styles/globals.css"
import React, { useState } from 'react';
import Card from "./Card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"



const CardCarousel = ({ cards, buttonText, buttonColor, type, address }) => {
    const [startIndex, setStartIndex] = useState(0);
    const cardsPerPage = 4;

    const [hoveringLeft, setHoveringLeft] = useState(false)
    const [hoveringRight, setHoveringRight] = useState(false)

    const hoverLeft = () => setHoveringLeft(true)
    const leaveLeft = () => setHoveringLeft(false)
    const hoverRight = () => setHoveringRight(true)
    const leaveRight = () => setHoveringRight(false)
    
    const handleNext = () => {
      if (startIndex + cardsPerPage < cards.length) {
        setStartIndex((prevIndex) => prevIndex + 1);
      }
    };
  
    const handlePrev = () => {
      if (startIndex > 0) {
        setStartIndex((prevIndex) => prevIndex - 1);
      }
    };
  
    return (
      <div className="carouselContainer">
        {cards.length < 5 || startIndex === 0
          ? <div></div>
          : <button className={`m-auto ${hoveringLeft ? "scale-up-buttons" : "scale-down-buttons"}`} onMouseEnter={hoverLeft} onMouseLeave={leaveLeft} onClick={handlePrev} disabled={startIndex === 0}>
              <FaChevronLeft />
            </button>}
          {cards.slice(startIndex, startIndex + cardsPerPage).map(({gameId, betAmount, creator, expirationDate, player2, winner, blockTimestamp}, index) => {
            return(
              <Card 
                  key={index}
                  gameId={gameId} 
                  betAmount={betAmount} 
                  creator={creator} 
                  deadline={expirationDate}
                  player2={player2}
                  winner={winner}
                  blockTimestamp={blockTimestamp}
                  buttonText={buttonText}
                  buttonColor={buttonColor}
                  type={type}
              />
            )
            })}
        {cards.length < 5 || startIndex === cards.length - cardsPerPage
          ? <div></div>
          : <button className={`m-auto ${hoveringRight ? "scale-up-buttons" : "scale-down-buttons"}`} onMouseEnter={hoverRight} onMouseLeave={leaveRight} onClick={handleNext} disabled={startIndex + cardsPerPage >= cards.length}>
              <FaChevronRight />
            </button>}
      </div>
    );
  };
  
  export default CardCarousel;