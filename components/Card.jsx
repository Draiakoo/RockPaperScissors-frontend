"use client"

import {useState, useContext, useEffect} from "react"
import "@styles/globals.css"
import Web3 from "web3";
import { formatDate } from "@dateHelper"
import { Web3Context } from "@context/Web3Context"
import { contractAddress, abi } from "@constants"


const Card = ({gameId, betAmount, creator, deadline, player2, winner, blockTimestamp, buttonText, buttonColor, type, address}) => {

  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address: connectedAddress, currentChainId, provider, balance, balanceGameUser },
  } = useContext(Web3Context)

  const [hovering, setHovering] = useState(false)
  const [gameInfo, setGameInfo] = useState("")

  const hover = () => setHovering(true)
  const leaveHover = () => setHovering(false)

  var formatedBetAmount = Web3.utils.fromWei(betAmount, 'ether')
    if(formatedBetAmount=="0."){
      formatedBetAmount = "0"
    }

  useEffect(() => {
    const getInfo = async () => {
      const contract = new provider.eth.Contract(abi, contractAddress)
      const transactionResponse = await contract.methods.gameInformation(gameId).call({from: connectedAddress})
      setGameInfo(transactionResponse)
    }
    getInfo()
  }, [gameId])
  
  var buttonTitle;
  if(buttonText==="Play the game"){
    if(gameInfo.gameState==2){
      if(connectedAddress==gameInfo.player1 && gameInfo.player1HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000"){
        buttonTitle="Submit hash"
      } else if(connectedAddress==gameInfo.player1 && gameInfo.player2HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000"){
        buttonTitle="Waiting for opponent's hash"
      } else if(connectedAddress==gameInfo.player2 && gameInfo.player2HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000"){
        buttonTitle="Submit hash"
      } else if(connectedAddress==gameInfo.player2 && gameInfo.player1HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000"){
        buttonTitle="Waiting for opponent's hash"
      }
    } else if(gameInfo.gameState==3){
      if(connectedAddress==gameInfo.player1 && Number(gameInfo.player1DecryptedChoice)==0){
        buttonTitle="Submit choice"
      } else if(connectedAddress==gameInfo.player1 && Number(gameInfo.player2DecryptedChoice)==0){
        buttonTitle="Waiting for opponent's choice"
      } else if(connectedAddress==gameInfo.player2 && Number(gameInfo.player2DecryptedChoice)==0){
        buttonTitle="Submit choice"
      } else if(connectedAddress==gameInfo.player2 && Number(gameInfo.player1DecryptedChoice)==0){
        buttonTitle="Waiting for opponent's choice"
      }
    }
  }

  return (
    <div className={`card ${hovering ? "scale-up" : "scale-down"}`} onMouseEnter={hover} onMouseLeave={leaveHover}>
        <div className="content">
          <div className="title">
            Game ID: {gameId}
          </div>
          <div className="description">
            Bet amount
          </div>
          <div className="price">
            {formatedBetAmount} ETH
          </div>
          <div className="description">
            Other information:
          </div>
          {type==="Active game" || type==="Finished game" || type==="Join game" || type==="Close game"
            ? <div className="description">
                Creator: {creator.substring(0,7) + " ... " + creator.substring(creator.length-5)}
              </div>
            : <></>
          }
          {type==="Active game" || type==="Finished game" || type==="Close game"
            ? <div className="description">
                Opponent: {player2.substring(0,7) + " ... " + player2.substring(player2.length-5)}
              </div>
            : <></>
          }
          {type==="Finished game"
            ? gameInfo.player1!="0x0000000000000000000000000000000000000000"
              ? winner!="0x0000000000000000000000000000000000000000"
                ? winner===connectedAddress.toLowerCase()
                  ? <div className="description">
                      Winner: YOU: {winner.substring(0,7) + " ... " + winner.substring(winner.length-5)}
                    </div>
                  : <div className="description">
                      Winner: opponent: {winner.substring(0,7) + " ... " + winner.substring(winner.length-5)}
                    </div>
                : <div className="description">
                    Winner: nobody, game was a tie
                  </div>
              : creator==connectedAddress.toLowerCase()
                ? <div className="description">You cancelled this game</div>
                : <div className="description">The creator cancelled this game</div>
            : <></>
          }
          {type==="Finished game"
            ? <div className="description">
                Game finished at timestamp: {blockTimestamp}
              </div>
            : <></>
          }
          {type==="Finished game"
            ? <div className="description">
                Game finished at {formatDate(parseInt(blockTimestamp))}
              </div>
            : <></>
          }
          {type==="Active game" || type==="Join game" || type==="Cancel game" || type==="Close game"
            ? <div className="description">
                Expiration timestamp: {deadline}
              </div>
            : <></>
          }
          {type==="Active game" || type==="Join game" || type==="Cancel game" || type==="Close game"
            ? <div className="description">
                Game ending at {formatDate(parseInt(deadline))}
              </div>
            : <></>
          }
          {type==="Finished game"
            ? gameInfo.player1!="0x0000000000000000000000000000000000000000"
              ? winner!="0x0000000000000000000000000000000000000000"
                ? winner===connectedAddress.toLowerCase()
                  ? <div className="description-editable text-green-800">Game won</div>
                  : <div className="description-editable text-red-800">Game lost</div>
                : <div className="description-editable text-blue-800">Game tie</div>
              : <div className="description-editable text-red-800">Game cancelled</div>
            : <></>
          }
          
          
          
        </div>
        {buttonText==="View information"
          ? <a className={"card-button bg-sky-500"} href={`/view-game-information?gameId=${gameId}`}>
              {buttonText}
            </a>
          : buttonText==="Join game"
            ? <a className={"card-button bg-lime-500"} href={`/join-game?gameId=${gameId}`}>
                {buttonText}
              </a>
            : buttonText==="Play the game"
              ? gameInfo.gameState==2
                ? <>
                    <a className={"card-button bg-yellow-300"} href={`/play-game?gameId=${gameId}`}>{buttonTitle}</a>
                    <a className={"card-button bg-sky-500"} href={`/view-game-information?gameId=${gameId}`}>View information</a>
                  </>
                : gameInfo.gameState==3
                  ? <>
                      <a className={"card-button bg-yellow-300"} href={`/play-game?gameId=${gameId}`}>{buttonTitle}</a>
                      <a className={"card-button bg-sky-500"} href={`/view-game-information?gameId=${gameId}`}>View information</a>
                    </>
                  : <></>
              : buttonText==="Cancel game"
                ? <a className={"card-button bg-red-700"} href={`/cancel-game?gameId=${gameId}`}>
                    {buttonText}
                  </a>
                : buttonText==="Close game"
                  ? <a className={"card-button bg-red-700"} href={`/close-game?gameId=${gameId}`}>
                      {buttonText}
                    </a>
                  : <></>}
    </div>
  )
}

export default Card