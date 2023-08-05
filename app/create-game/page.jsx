"use client"

import Footer from "@components/Footer"
import { Web3Context } from "@context/Web3Context";
import "@styles/globals.css"
import {useContext, useState, useEffect, useRef} from "react"
import { contractAddress, abi } from "@constants";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3"
import Big from 'big.js';
import { chains, supportedChains } from "@chains";


export default function Home() {

  const betValue = useRef(null);
  const durationValue = useRef(null);
  const addressValue = useRef(null);

  const [disabledButton, setDisabledButton] = useState(false)
  const [gameId, setGameId] = useState("-")
  const [isCreated, setIsCreated] = useState(false)

  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser },
  } = useContext(Web3Context)

  const validateBet = (input) => {
    var validInput = true;
    if(input===""){
      validInput=false
    }
    for(let i=0;i<input.length;i++){
      if(!".0123456789".includes(input.substring(i, i+1))){
        validInput = false;
      }
    }
    if(validInput){
      try {
        input = Web3.utils.toWei(input, 'ether');
      } catch (error) {
        validInput = false;
      }
    }
    if(!validInput){
      toast.error("Invalid input", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } 
    return validInput;
  }

  const validateDuration = (input) => {
    var validInput = true;
    if(input===""){
      validInput=false
      toast.error("Invalid input", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    if(parseInt(input)<1){
      validInput=false
      toast.error("Minimum game duration is 1 day", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return validInput;
  }

  const validateAddress = (input) => {
    var validInput = true;
    if(input!==""){
      if(!Web3.utils.isAddress(input)){
        toast.error("Invalid address provided", {
          position: toast.POSITION.TOP_RIGHT,
        });
        validInput = false;
      }
    }
    return validInput;
  }

  const handleCreate = async () => {
    // Validate bet amount
    var valueBet = betValue.current.value
    var validInput1 = validateBet(valueBet)
    if(validInput1){
      const balanceUser = Web3.utils.toWei(balanceGameUser, 'ether');
      valueBet = Web3.utils.toWei(valueBet, 'ether');
      if(new Big(valueBet).gt(new Big(balanceUser))){
        validInput1 = false;
        toast.error("You does not have enough balance to pay as bet", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    // Validate suration amount
    var valueDuration = durationValue.current.value
    var validInput2 = validateDuration(valueDuration)
    var durationParam = 0
    if(validInput2){
      durationParam = (valueDuration * 24 * 3600).toString()
    }
    // Validate address of opponent
    var valueAddress = addressValue.current.value
    var validInput3 = validateAddress(valueAddress)
    // Execute the transaction
    if(validInput1 && validInput2 && validInput3){
      const contract = new provider.eth.Contract(abi, contractAddress);
      try {
        const gameIdCounter = await contract.methods.gameIdCounter().call({from: address})
        setGameId(gameIdCounter.toString())
        toast.info("Executing transaction...", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setDisabledButton(true)
        if(valueAddress===""){
          const transactionResponse = await contract.methods.createLobby(valueBet, durationParam, "0x0000000000000000000000000000000000000000").send({from: address})
          toast.success("Transaction success", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsCreated(true)
          setDisabledButton(false)
        } else{
          const transactionResponse = await contract.methods.createLobby(valueBet, durationParam, valueAddress).send({from: address})
          toast.success("Transaction success", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsCreated(true)
        }
        
      } catch (error) {
        if(error.message==="Returned error: MetaMask Tx Signature: User denied transaction signature."){
          setDisabledButton(false)
          toast.error("Transaction denied", {
              position: toast.POSITION.TOP_RIGHT,
            });
        } else {
          toast.error("Error: " + error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  }

  if(supportedChains.includes(chains[currentChainId])){
    return (
      <>
        <div className="toast-container"><ToastContainer limit={2}/></div>
        <h1 className="text-center underline p-5 text-4xl font-bold">
            Create a game
        </h1>
        <p className="ml-36 mt-36 pl-7">* = mandatory fields</p>
        <div className="grid grid-cols-3 py-7 mx-36">
          <div className="text-center">
            <h4>Bet amount *</h4>
            <input placeholder="Amount to bet in ETH" className="w-52" ref={betValue}></input>
          </div>
  
          <div className="text-center">
            <h4>Game duration *</h4>
            <input placeholder="Game duration in days" type="number" className="w-52" ref={durationValue}></input>
          </div>
  
          <div className="text-center">
            <h4>Opponent address</h4>
            <input placeholder="Address of the opponent" className="w-52" ref={addressValue}></input>
          </div>
        </div>
        {disabledButton
          ? <button className="custom-button mx-auto mt-16" disabled>Create game</button>
          : <button className="custom-button mx-auto mt-16" onClick={handleCreate}>Create game</button>
        }
        {
          isCreated
            ? <p className="ml-36 mt-36 mb-10 text-center text-4xl font-bold text-green-800">Game created successfully. Game ID: {gameId}</p>
            : <></>
        }
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
