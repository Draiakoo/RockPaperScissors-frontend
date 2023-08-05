"use client"

import Footer from "@components/Footer"
import InteractionWindow from "@components/InteractionWindow"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useContext } from "react"
import { contractAddress, abi, gameStates, helperContractAddress, helperContractAbi } from "@constants";
import { Web3Context } from "@context/Web3Context";
import Web3 from "web3";
import { formatDate } from "@dateHelper"
import { useRouter } from 'next/navigation'
import { chains, supportedChains } from "@chains";


export default function PlayGame() {

  const router = useRouter()

  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
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
        if(gameStateFetched==2){
          if(address==transactionResponse.player1){
            if(transactionResponse.player1HashSubmit!="0x0000000000000000000000000000000000000000000000000000000000000000"){
              setAlreadySubmitted(true)
            }
          } else if(address==transactionResponse.player2){
            if(transactionResponse.player2HashSubmit!="0x0000000000000000000000000000000000000000000000000000000000000000"){
              setAlreadySubmitted(true)
            }
          } 
        } else if(gameStateFetched==3){
          const player1Choice = Number(transactionResponse.player1DecryptedChoice)
          const player2Choice = Number(transactionResponse.player2DecryptedChoice)
          if(address==transactionResponse.player1){
            if(player1Choice!=0){
              setAlreadySubmitted(true)
            }
          } else if(address==transactionResponse.player2){
            if(player2Choice!=0){
              setAlreadySubmitted(true)
            }
          }
        }
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
            <h1 className="text-center underline p-5 text-4xl font-bold">
                Playing game {gameId}
            </h1>
            <p className="ml-36 mt-10 underline text-2xl">Game information:</p>
            <p className="ml-36">Creator: {gameInformation.player1}</p>
            <p className="ml-36">Opponent: {gameInformation.player2}</p>
            <p className="ml-36">Bet amount: {formatedBetAmount} ETH</p>
            <p className="ml-36 mb-10">Expiration date: {formatDate(Number(gameInformation.deadline))}</p>
            <p className="ml-36 mb-10 text-center text-3xl">Current state: {gameStates[gameState]}</p>
            <InteractionWindow gameId={gameId} state={gameState} alreadySubmitted={alreadySubmitted} isPlayer={isPlayer} isExpired={isExpired}/>
            {(gameState!=2 && gameState!=3) || isExpired
              ? <button className="custom-button mx-auto mt-10" onClick={() => {router.push(`/view-game-information?gameId=${gameId}`)}}>Check game results</button>
              : <></>
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