"use client"

import Footer from "@components/Footer"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useContext, useRef } from "react"
import { contractAddress, abi, gameStates, helperContractAddress, helperContractAbi } from "@constants";
import { Web3Context } from "@context/Web3Context";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { formatDate } from "@dateHelper"
import { chains, supportedChains } from "@chains";



export default function PlayGame() {

  const handleCancelGame = async () => {
    const contract = new provider.eth.Contract(abi, contractAddress);
    toast.info("Executing transaction...", {
        position: toast.POSITION.TOP_RIGHT,
      });
    setDisabledButton(true)
    try{
        const transaction = await contract.methods.cancelGameLobby(gameId).send({from: address})
        toast.success("Transaction success", {
            position: toast.POSITION.TOP_RIGHT,
          });
        setTimeout(() => {router.current.click()}, 2000)
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

  const router = useRef(null)

  const [gameState, setGameState] = useState(0)
  const [isCreator, setIsCreator] = useState(false)
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
      if(address!=transactionResponse.player1){
        setIsCreator(false)
      } else {
        setIsCreator(true)
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
                Checking game information
            </h1>
          </div>
      )
    } else {
      var formatedBetAmount = Web3.utils.fromWei(gameInformation.betAmount, 'ether')
      if(formatedBetAmount=="0."){
        formatedBetAmount="0"
      }
      return(
        <div className="pb-10">
          <a ref={router} href={`/view-game-information?gameId=${gameId}`}></a>
          <div className="toast-container"><ToastContainer limit={2}/></div>
            <h1 className="text-center underline p-5 text-4xl font-bold">
                Cancelation of game {gameId}
            </h1>
            <p className="ml-36 mt-10 underline text-2xl">Game information:</p>
            <p className="ml-36">Creator: {gameInformation.player1}</p>
            <p className="ml-36">Opponent: {gameInformation.player2}</p>
            <p className="ml-36">Bet amount: {formatedBetAmount} ETH</p>
            <p className="ml-36 mb-10">Expiration date: {formatDate(parseInt(gameInformation.deadline))}</p>
            <p className="ml-36 mb-10 text-center text-3xl">Current state: {gameStates[gameState]}</p>
            {
              !isExpired && gameState===1 && isCreator 
                ? <p className="ml-36 mb-10 text-center text-4xl font-bold text-green-800">You can cancel this game</p>
                : isExpired
                  ? <>
                      <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT cancel this game</p>
                      <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: game has expired</p>
                    </>
                  : !isCreator
                    ? <>
                        <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT cancel this game</p>
                        <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: you are not the creator of this game</p>
                      </>
                    : gameState===1
                      ? <></>
                      : <>
                          <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT cancel this game</p>
                          <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: wrong game state. It is either not created, active or finished</p>
                        </>
            }
            
            {!isExpired && gameState===1 && isCreator
              ? disabledButton
                ? <button className="custom-button mx-auto mt-10" disabled>Cancel game</button>
                : <button className="custom-button mx-auto mt-10" onClick={handleCancelGame}>Cancel game</button>
              : <button className="custom-button mx-auto mt-10" disabled>Cancel game</button>
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