"use client"

import "@styles/globals.css"
import Link from "next/link"
import Image from "next/image"
import { Web3Context } from "../context/Web3Context";
import {useContext, useState, useEffect} from "react"
import { FaCaretDown } from "react-icons/fa"
import { chains, supportedChains, supportedNetworksInfo } from "@chains";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Nav = () => {

  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser },
  } = useContext(Web3Context);

  const changeNetwork = async (network) => {
    if(!window.ethereum){
      console.log("Metamask is not installed, please install!");
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0xaa36a7"}],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
       console.log("This network is not available in your metamask, please add it")
      } else if(switchError.code === 4001){
        toast.error("Network change denied", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      console.log(switchError)
    }
  }
  if(supportedChains.includes(chains[currentChainId])){
    return (
      <nav className="bg-cyan-900">
          <div className="toast-container"><ToastContainer limit={2}/></div>
          <div className="flex-between w-full px-10 py-3 ">
              <Link href="/balance-dashboard" className="flex gap-2 flex-center">
              <Image 
              src="/game_logo.jpg"
              alt="Promptopia Logo"
              width={30}
              height={30}
              className="object-contain rounded-full"
              />
              <p className="logo_text">Balance dashboard</p>
              </Link>
              <p className="logo_text">Your balance: {balanceGameUser} ETH</p>
              {!isAuthenticated ? (
                <button className="custom-button" onClick={connectWallet}>
                  Connect wallet
                </button>
              ) : (
                <div className="flex">
                  <div className="navdropdown">
                    <button className="navdropbtn">
                      {chains[currentChainId]} <FaCaretDown/>
                    </button>
                    <div className="navdropdown-content">
                      {supportedNetworksInfo.map(({name, chainId}, index) => {
                        return(
                          <p key={index} onClick={() => changeNetwork(chainId)}>{name}</p>
                        )
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-400 shadow-lg mx-3 px-3 rounded-lg">
                    <p>Address connected: {address.substring(0,6) + "..." +address.substring(address.length-4, address.length)}</p>
                    <p>Balance: {balance}</p>
                  </div>
                  <button className="custom-button" onClick={disconnect}>
                  Disconnect
                  </button>
                </div>
              )}
          </div>
          
      </nav>
    )
  } else {
    return (
      <nav className="bg-cyan-900">
          <div className="toast-container"><ToastContainer limit={2}/></div>
          <div className="flex-between w-full px-10 py-3 ">
              <p className="logo_text">You must change to a supported network</p>
              {!isAuthenticated ? (
                <button className="custom-button" onClick={connectWallet}>
                  Connect wallet
                </button>
              ) : (
                <div className="flex">
                  <div className="navdropdown">
                    <button className="navdropbtn">
                      {chains[currentChainId]} <FaCaretDown/>
                    </button>
                    <div className="navdropdown-content">
                      {supportedNetworksInfo.map(({name, chainId}, index) => {
                        return(
                          <p key={index} onClick={() => changeNetwork(chainId)}>{name}</p>
                        )
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-400 shadow-lg mx-3 px-3 rounded-lg">
                    <p>Address connected: {address.substring(0,6) + "..." +address.substring(address.length-4, address.length)}</p>
                  </div>
                  <button className="custom-button" onClick={disconnect}>
                  Disconnect
                  </button>
                </div>
              )}
          </div>
          
      </nav>
    )
  }

  
}

export default Nav