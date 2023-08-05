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
import { choices } from "@actionList"
import { chains, supportedChains } from "@chains";



export default function CloseGame() {

  const handleCloseGame = async () => {
    const contract = new provider.eth.Contract(abi, contractAddress);
    toast.info("Executing transaction...", {
        position: toast.POSITION.TOP_RIGHT,
      });
    setDisabledButton(true)
    try{
        const transaction = await contract.methods.checkGameState(gameId).send({from: address})
        toast.success("Transaction success", {
            position: toast.POSITION.TOP_RIGHT,
          });
    } catch(error) {
        if(error.message==="Returned error: MetaMask Tx Signature: User denied transaction signature."){
            setDisabledButton(false)
            toast.error("Transaction denied", {
                position: toast.POSITION.TOP_RIGHT,
              });
        }
    }
  }


  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

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
      if(address!=transactionResponse.player1 && address!=transactionResponse.player2){
        setIsPlayer(false)
      } else {
        setIsPlayer(true)
      }
      setGameInformation(transactionResponse)
      setGameState(gameStateFetched)
      setIsLoading(false)
    }
    if(provider != null){
      validGame()
    }
  }, [address])


  if(supportedChains.includes(chains[currentChainId])){
    if(isLoading){
      return(
        <div className="pb-10">
            <h1 className="text-center underline p-5 text-4xl font-bold">
                Closing game state
            </h1>
          </div>
      )
    } else {
      var formatedBetAmount = Web3.utils.fromWei(gameInformation.betAmount, 'ether')
      if(formatedBetAmount=="0."){
        formatedBetAmount = "0"
      }
      return(
        <div className="pb-10">
          <div className="toast-container"><ToastContainer limit={2}/></div>
            <h1 className="text-center underline p-5 text-4xl font-bold">
                Closing of game {gameId}
            </h1>
            <p className="ml-36 mt-10 underline text-2xl">Game information:</p>
            <p className="ml-36">Creator: {gameInformation.player1}</p>
            <p className="ml-36">Opponent: {gameInformation.player2}</p>
            <p className="ml-36">Bet amount: {formatedBetAmount} ETH</p>
            {gameState==2 || gameState==3
              ? gameInformation.player1HashSubmit!=="0x0000000000000000000000000000000000000000000000000000000000000000"
                ? <p className="ml-36">Player 1 submited his hash? Yes: {gameInformation.player1HashSubmit}</p>
                : <p className="ml-36">Player 1 submited his hash? No</p>
              : <></>
              
            }
            {gameState==2 || gameState==3
              ? gameInformation.player2HashSubmit!=="0x0000000000000000000000000000000000000000000000000000000000000000"
                ? <p className="ml-36">Player 2 submited his hash? Yes: {gameInformation.player2HashSubmit}</p>
                : <p className="ml-36">Player 2 submited his hash? No</p>
              : <></>
            }
            {gameState==2 || gameState==3
              ? Number(gameInformation.player1DecryptedChoice)!=0
                ? <p className="ml-36">Player 1 revealed his choice? Yes: {choices[Number(gameInformation.player1DecryptedChoice)]}</p>
                : <p className="ml-36">Player 1 revealed his choice? No</p>
              : <></>
            }
            {gameState==2 || gameState==3
              ? Number(gameInformation.player2DecryptedChoice)!=0
                ? <p className="ml-36">Player 2 revealed his choice? Yes: {choices[Number(gameInformation.player2DecryptedChoice)]}</p>
                : <p className="ml-36">Player 2 revealed his choice? No</p>
              : <></>
            }
            <p className="ml-36 mb-10">Expiration date: {formatDate(parseInt(gameInformation.deadline))}</p>
            <p className="ml-36 mb-10 text-center text-3xl">Current state: {gameStates[gameState]}</p>
            {console.log(isPlayer)}
            {
              isExpired && isPlayer && gameState!=0 && gameState!=4
                ? <p className="ml-36 mb-10 text-center text-4xl font-bold text-green-800">You can close this game</p>
                : !isPlayer
                  ? <>
                      <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT close this game</p>
                      <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: you are not a player of this game</p>
                    </>
                  : gameState===0 || gameState===4
                    ? <>
                        <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT close this game</p>
                        <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: wrong game state. It is either not created or finished</p>
                      </>
                    : !isExpired
                      ? <>
                          <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT close this game</p>
                          <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: game has NOT expired</p>
                        </>
                      : <></>
            }
            
            {isExpired && isPlayer && gameState!=0 && gameState!=4
              ? disabledButton
                ? <button className="custom-button mx-auto mt-10" disabled>Close game</button>
                : <button className="custom-button mx-auto mt-10" onClick={handleCloseGame}>Close game</button>
              : <button className="custom-button mx-auto mt-10" disabled>Close game</button>
            }
            <Footer />
        </div>
      )
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