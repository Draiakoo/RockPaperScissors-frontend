"use client"

import Footer from "@components/Footer"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useContext } from "react"
import { contractAddress, abi, gameStates, helperContractAddress, helperContractAbi } from "@constants";
import { Web3Context } from "@context/Web3Context";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { formatDate } from "@dateHelper"
import { useRouter } from 'next/navigation';
import { choices } from "@actionList"
import { useQuery, gql } from "@apollo/client"
import { chains, supportedChains } from "@chains";



export default function CheckGame() {

  const queryCancellableGamesNoFilter = (gameId) => {
    return(
      gql`
    {
      stateOfGames (where: 
        {
          gameId: ${gameId},
        }){
        gameId
        creator
        player2
        betAmount
        expirationDate
        state
        winner
        blockTimestamp
      }
    }
  `
    )
  }

  const handleCloseGame = () => {
    router.push(`/close-game?gameId=${gameId}`)
  }

  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

  const {loading, error, data} = useQuery(queryCancellableGamesNoFilter(gameId))

  const router = useRouter()

  const [disabledButton, setDisabledButton] = useState(false)

  const [gameState, setGameState] = useState(0)
  const [isPlayer, setIsPlayer] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [gameInformation, setGameInformation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const {state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser }} = useContext(Web3Context);

  useEffect(() => {
    const validGame = async () =>{
      const contract = new provider.eth.Contract(abi, contractAddress);
      const transactionResponse = await contract.methods.gameInformation(gameId).call({from: address})
      const gameStateFetched = Number(transactionResponse.gameState)
      const helperContract = new provider.eth.Contract(helperContractAbi, helperContractAddress)
      const expiredGame = await helperContract.methods.checkExpirationDate(gameId).call({from: address})
      setIsExpired(expiredGame)
      if(address==transactionResponse.player1 || address==transactionResponse.player2){
        setIsPlayer(true)
      } else {
        setIsPlayer(false)
      }
      setGameInformation(transactionResponse)
      setGameState(gameStateFetched)
      setIsLoading(false)
    }
    if(provider != null){
      validGame()
    }
  }, [address])

  var formatedBetAmount;
  try{
    formatedBetAmount = Web3.utils.fromWei(data["stateOfGames"][0].betAmount, 'ether')
    if(formatedBetAmount=="0."){
      formatedBetAmount = "0"
    }
  } catch(error){
    formatedBetAmount = "0"
  }

  if(supportedChains.includes(chains[currentChainId])){
    if(!isLoading && data!=undefined){
      console.log(data["stateOfGames"].length)
      if(data["stateOfGames"].length===0){
        return(
          <>
            <h1 className="text-center underline p-5 text-4xl font-bold">
              Information game {gameId}
            </h1>
            <p className="ml-36 mt-10 underline text-2xl">Game information:</p>
            <p className="ml-36">Creator: 0x0000000000000000000000000000000000000000</p>
            <p className="ml-36">Opponent: 0x0000000000000000000000000000000000000000</p>
            <p className="ml-36">Bet amount: 0 ETH</p>
            <p className={`ml-36`}>
              Timestamp expiration: -
            </p>
            <p className={`ml-36`}>
              Expiration date: -
            </p>
            <p className="mb-10 text-center text-2xl bold">Current state: Game not initialized</p>         
            <Footer />
          </>
        )
      } else if(gameInformation.player1=="0x0000000000000000000000000000000000000000" && data["stateOfGames"][0].state==3){
        return (
          <>
            <h1 className="text-center underline p-5 text-4xl font-bold">
              Information game {gameId}
            </h1>
            <p className="ml-36 mt-10 underline text-2xl">Game information:</p>
            <p className="ml-36">Creator: {data["stateOfGames"][0].creator}</p>
            <p className="ml-36">Opponent: {data["stateOfGames"][0].player2}</p>
            {
              gameInformation.betAmount!=null
                ? <p className="ml-36">Bet amount: {formatedBetAmount} ETH</p>
                : <p className="ml-36">Bet amount: - ETH</p>
            }
            <p className={`ml-36`}>
              Timestamp expiration: {data["stateOfGames"][0].expirationDate}
            </p>
            <p className={`ml-36`}>
              Expiration date: {formatDate(parseInt(data["stateOfGames"][0].expirationDate))}
            </p>
            <p className="mb-10 text-center text-2xl bold">Current state: Game cancelled</p>
            <p className="mb-10 text-center text-2xl bold">by {data["stateOfGames"][0].creator}</p>
            
            <Footer />
          </>
        )
      } else {
        var winner;
        if(gameInformation.player1HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000" && gameInformation.player2HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000"){
          winner = "0x0000000000000000000000000000000000000000"
        } else if(gameInformation.player1HashSubmit!="0x0000000000000000000000000000000000000000000000000000000000000000" && gameInformation.player2HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000"){
          winner = gameInformation.player1
        } else if(gameInformation.player1HashSubmit=="0x0000000000000000000000000000000000000000000000000000000000000000" && gameInformation.player2HashSubmit!="0x0000000000000000000000000000000000000000000000000000000000000000"){
          winner = gameInformation.player2
        } else if(Number(gameInformation.player1DecryptedChoice)==0 && Number(gameInformation.player2DecryptedChoice)==0){
          winner = "0x0000000000000000000000000000000000000000"
        } else if(Number(gameInformation.player1DecryptedChoice)!=0 && Number(gameInformation.player2DecryptedChoice)==0){
          winner = gameInformation.player1
        } else if(Number(gameInformation.player1DecryptedChoice)==0 && Number(gameInformation.player2DecryptedChoice)!=0){
          winner = gameInformation.player2
        } else if(Number(gameInformation.player1DecryptedChoice)!=0 && Number(gameInformation.player2DecryptedChoice)!=0){
          if(Number(gameInformation.player1DecryptedChoice)===1 && Number(gameInformation.player2DecryptedChoice)===1){
            winner = "0x0000000000000000000000000000000000000000"
          } else if(Number(gameInformation.player1DecryptedChoice)===1 && Number(gameInformation.player2DecryptedChoice)===2){
            winner = gameInformation.player2
          } else if(Number(gameInformation.player1DecryptedChoice)===1 && Number(gameInformation.player2DecryptedChoice)===3){
            winner = gameInformation.player1
          } else if(Number(gameInformation.player1DecryptedChoice)===2 && Number(gameInformation.player2DecryptedChoice)===1){
            winner = gameInformation.player1
          } else if(Number(gameInformation.player1DecryptedChoice)===2 && Number(gameInformation.player2DecryptedChoice)===2){
            winner = "0x0000000000000000000000000000000000000000"
          } else if(Number(gameInformation.player1DecryptedChoice)===2 && Number(gameInformation.player2DecryptedChoice)===3){
            winner = gameInformation.player2
          } else if(Number(gameInformation.player1DecryptedChoice)===3 && Number(gameInformation.player2DecryptedChoice)===1){
            winner = gameInformation.player2
          } else if(Number(gameInformation.player1DecryptedChoice)===3 && Number(gameInformation.player2DecryptedChoice)===2){
            winner = gameInformation.player1
          } else if(Number(gameInformation.player1DecryptedChoice)===3 && Number(gameInformation.player2DecryptedChoice)===3){
            winner = "0x0000000000000000000000000000000000000000"
          }
        }
  
        return (
          <>
            <h1 className="text-center underline p-5 text-4xl font-bold">
              Information game {gameId}
            </h1>
            <p className="ml-36 mt-10 underline text-2xl">Game information:</p>
            {
              address==gameInformation.player1
                ? <p className="ml-36">Creator: You</p>
                : <p className="ml-36">Creator: {gameInformation.player1}</p>
            }
            {
              address==gameInformation.player2
                ? <p className="ml-36">Opponent: You</p>
                : <p className="ml-36">Opponent: {gameInformation.player2}</p>
            }
            {
              gameInformation.betAmount!=null
                ? <p className="ml-36">Bet amount: {formatedBetAmount} ETH</p>
                : <p className="ml-36">Bet amount: - ETH</p>
            }
            {
              gameInformation.player1HashSubmit!=="0x0000000000000000000000000000000000000000000000000000000000000000"
                ? <p className="ml-36">Player 1 submited his hash? Yes: {gameInformation.player1HashSubmit}</p>
                : <p className="ml-36">Player 1 submited his hash? No</p>
            }
            {
              gameInformation.player2HashSubmit!=="0x0000000000000000000000000000000000000000000000000000000000000000"
                ? <p className="ml-36">Player 2 submited his hash? Yes: {gameInformation.player2HashSubmit}</p>
                : <p className="ml-36">Player 2 submited his hash? No</p>
            }
            {
              Number(gameInformation.player1DecryptedChoice)!=0
                ? <p className="ml-36">Player 1 revealed his choice? Yes: {choices[Number(gameInformation.player1DecryptedChoice)]}</p>
                : <p className="ml-36">Player 1 revealed his choice? No</p>
            }
            {
              Number(gameInformation.player2DecryptedChoice)!=0
                ? <p className="ml-36">Player 2 revealed his choice? Yes: {choices[Number(gameInformation.player2DecryptedChoice)]}</p>
                : <p className="ml-36">Player 2 revealed his choice? No</p>
            }
            <p className={`ml-36`}>
              Timestamp expiration: {gameInformation.deadline}
            </p>
            <p className={`ml-36`}>
              Expiration date: {formatDate(parseInt(gameInformation.deadline))}
            </p>
            <p className="mb-10 text-center text-2xl bold">Current state: {gameStates[gameState]}</p>
            {
              Number(gameInformation.player1DecryptedChoice)!=0 && Number(gameInformation.player2DecryptedChoice)!=0
                ? winner === "0x0000000000000000000000000000000000000000"
                  ? <p className="mb-10 text-center text-3xl bold">The game was a tie, no winner was declared</p>
                  : winner === gameInformation.player1
                    ? <p className="mb-10 text-center text-3xl bold">Game winner: player1 "{gameInformation.player1}"</p>
                    : winner === gameInformation.player2
                      ? <p className="mb-10 text-center text-3xl bold">Game winner: player2 "{gameInformation.player2}"</p>
                      : <></>
                : <></> 
            }
            {gameState==4
              ? winner != "0x0000000000000000000000000000000000000000"
                ? address==gameInformation.player1 || address==gameInformation.player2
                  ? address==winner
                    ? <p className="ml-36 mb-10 text-center text-4xl font-bold text-green-800">You won this game</p>
                    : <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You lost this game</p>
                  : <p className="ml-36 mb-10 text-center text-4xl font-bold text-black-800">You did not play this game</p>
                : <></>
              : <></>
            }
      
            {isExpired && isPlayer && gameState!=4
            ? <div className="text-center">
                <p className="my-10 text-2xl bold">You can close this game and check for the results</p>
                <button className="custom-button mx-auto" onClick={handleCloseGame}>Close game {gameId}</button>
              </div>
            : <></>
            }
            <Footer />
          </>
        )
      }
    }
  } else {
    return (
      <>
        <div className="text-center mt-56">
          Please change to a supported network
        </div>
      </>
    )
  }
  
  
}