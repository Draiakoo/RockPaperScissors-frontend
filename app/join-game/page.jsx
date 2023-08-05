"use client"

import Footer from "@components/Footer"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useContext } from "react"
import { contractAddress, abi, gameStates, helperContractAddress, helperContractAbi } from "@constants";
import { Web3Context } from "@context/Web3Context";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Big from 'big.js';
import { chains, supportedChains } from "@chains";
import { formatDate } from "@dateHelper";


export default function JoinGame() {

  const handleJoinGame = async () => {
    const contract = new provider.eth.Contract(abi, contractAddress);
    toast.info("Executing transaction...", {
        position: toast.POSITION.TOP_RIGHT,
      });
    setDisabledButton(true)
    try{
        const transaction = await contract.methods.joinGameLobby(gameId).send({from: address})
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
  const [isExpired, setIsExpired] = useState(false)
  const [gameInformation, setGameInformation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [enoughBalance, setEnoughBalance] = useState(false)
  const {state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser }} = useContext(Web3Context);

  useEffect(() => {
    const validGame = async () =>{
      const contract = new provider.eth.Contract(abi, contractAddress);
      const transactionResponse = await contract.methods.gameInformation(gameId).call({from: address})
      const gameStateFetched = Number(transactionResponse.gameState)
      const helperContract = new provider.eth.Contract(helperContractAbi, helperContractAddress)
      const expiredGame = await helperContract.methods.checkExpirationDate(gameId).call({from: address})
      console.log(expiredGame)
      setIsExpired(expiredGame)
      setGameInformation(transactionResponse)
      setGameState(gameStateFetched)
      setIsLoading(false)
      if(gameInformation.betAmount!=undefined){
        if(new Big(gameInformation.betAmount).gt(new Big(Web3.utils.toWei(balanceGameUser, 'ether')))){
          setEnoughBalance(false)
        } else {
          setEnoughBalance(true)
        }
      }
    }
    if(provider != null){
      validGame()
    }
  }, [address, balanceGameUser, gameInformation.betAmount])


  if(supportedChains.includes(chains[currentChainId])){
    if(isLoading){
      return(
        <div className="pb-10">
            <h1 className="text-center underline p-5 text-4xl font-bold">
                Checking game state
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
                Joining game {gameId}
            </h1>
            <p className="ml-36 mt-10 underline text-2xl">Game information:</p>
            <p className="ml-36">Creator: {gameInformation.player1}</p>
            {gameState===1
              ? gameInformation.player2===address
                ? <p className="ml-36">Opponent: Reserved for you</p>
                : gameInformation.player2==="0x0000000000000000000000000000000000000000"
                  ? <p className="ml-36">Opponent: Open for everybody</p>
                  : <p className="ml-36">Opponent: Reserved for an other address</p>
              : <p className="ml-36">Opponent: {gameInformation.player2}</p>
            
            }
            
            <p className="ml-36">Bet amount: {formatedBetAmount} ETH</p>
            <p className="ml-36 mb-10">Expiration date: {formatDate(parseInt(gameInformation.deadline))}</p>
            <p className="ml-36 mb-10 text-center text-3xl">Current state: {gameStates[gameState]}</p>
            {
              !isExpired && gameState===1 && enoughBalance && (gameInformation.player2==="0x0000000000000000000000000000000000000000" || gameInformation.player2===address) 
                ? <p className="ml-36 mb-10 text-center text-4xl font-bold text-green-800">You can join this game</p>
                : isExpired
                  ? <>
                      <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT join this game</p>
                      <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: game has expired</p>
                    </>
                  : gameState!==1
                    ? <>
                        <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT join this game</p>
                        <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: wrong game state. It is either not created, active or finished</p>
                      </>
                    : !(gameInformation.player2==="0x0000000000000000000000000000000000000000" || gameInformation.player2===address)
                      ? <>
                          <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT join this game</p>
                          <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: the game is reserved for an other address</p>
                        </>
                      : !enoughBalance
                        ? <>
                            <p className="ml-36 mb-10 text-center text-4xl font-bold text-red-800">You can NOT join this game</p>
                            <p className="ml-36 mb-10 text-center text-2xl font-bold text-red-800">Reason: not enough balance to pay the bet amount</p>
                          </>
                        : <></>
            }
            
            {!isExpired && gameState===1 && enoughBalance && (gameInformation.player2==="0x0000000000000000000000000000000000000000" || gameInformation.player2===address)
              ? disabledButton
                ? <button className="custom-button mx-auto mt-10" disabled>Join game</button>
                : <button className="custom-button mx-auto mt-10" onClick={handleJoinGame}>Join game</button>
              : <button className="custom-button mx-auto mt-10" disabled>Join game</button>
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