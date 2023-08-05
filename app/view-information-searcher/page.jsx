"use client"

import Footer from "@components/Footer"
import "@styles/globals.css"
import {useRef, useContext} from "react"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { chains, supportedChains } from "@chains";
import { Web3Context } from "@context/Web3Context";


export default function ViewInformationGameSearcher() {

  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser },
  } = useContext(Web3Context)

  const router = useRouter()

  const gameIdValue = useRef(null);

  const handleViewInformation = () => {
    const gameId = gameIdValue.current.value
    if(gameId=="" || parseInt(gameId)<0 || gameId.includes(".") || gameId.includes(",")){
      toast.error("Error: invalid game ID", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else{
      router.push(`/view-game-information?gameId=${gameId}`)
    }
  }

  if(supportedChains.includes(chains[currentChainId])){
    return (
      <>
        <div className="toast-container"><ToastContainer limit={2}/></div>
        <h1 className="text-center underline p-5 text-4xl font-bold">
          View information a game
        </h1>
        <div className="text-center">
            <h4>Game id</h4>
            <input placeholder="Game id" type="number" className="w-52" ref={gameIdValue}></input>
          </div>
        <button className="custom-button mx-auto mt-16" onClick={handleViewInformation}>View information of the game</button>
        <Footer />
      </>
    )
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
