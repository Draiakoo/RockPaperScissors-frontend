import "@styles/globals.css"
import Card from "./Card"
import useWindowSize from "@hooks/useWindowSize"

const GameList = ({games}) => {

  const size = useWindowSize();

  return (
    <div className={`px-10 mx-36 grid ${size.width > 1100 ? "grid-cols-4" : size.width > 800 ? "grid-cols-3" : "grid-cols-2"}`}>
      {games.map(({gameId, betAmount, creator, deadline}, index) => {
        return(
          <Card 
            key={index}
            gameId={gameId} 
            betAmount={betAmount} 
            creator={creator} 
            deadline={deadline}
          />
        )
      })}
    </div>
  )
}

export default GameList