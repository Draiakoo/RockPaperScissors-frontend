"use client"

import Image from "next/image";
import {useState, useRef, useContext} from "react";
import "@styles/globals.css";
import Web3 from "web3"
import { contractAddress, abi } from "@constants";
import { Web3Context } from "@context/Web3Context";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const InteractionWindow = ({gameId, state, alreadySubmitted, isPlayer, isExpired}) => {

    const {
        connectWallet,
        disconnect,
        state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser },
      } = useContext(Web3Context)

    const passwordValue = useRef(null);
    const [disabledButton, setDisabledButton] = useState(false)
    const [selectedChoice, setSelectedChoice] = useState("Rock")


    const handleSendHash = async () => {
        const password = passwordValue.current.value
        const hashedChoice = Web3.utils.soliditySha3({ type: 'string', value: selectedChoice }, { type: 'string', value: password })
        const contract = new provider.eth.Contract(abi, contractAddress);
        toast.info("Executing transaction...", {
            position: toast.POSITION.TOP_RIGHT,
          });
        setDisabledButton(true)
        try{
            const transaction = await contract.methods.submitHash(gameId, hashedChoice).send({from: address})
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

    const handleSendChoice = async () => {
        const password = passwordValue.current.value
        const contract = new provider.eth.Contract(abi, contractAddress);
        toast.info("Executing transaction...", {
            position: toast.POSITION.TOP_RIGHT,
          });
        setDisabledButton(true)
        try {
            await contract.methods.submitChoice(gameId, selectedChoice, password).send({from: address})
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


    return (
      <div className="playing-box pb-10 relative">
        <div className="toast-container"><ToastContainer limit={2}/></div>
        {isExpired
        ? <img className="overlapping-image" src="/playing-errors/expired_game.png"></img>
        : (state!=2 && state!=3)
            ? <img className="overlapping-image" src="/playing-errors/wrong_state.png"></img>
            : !isPlayer
                ? <img className="overlapping-image" src="/playing-errors/not_player.png"></img>
                : state==2 && alreadySubmitted
                    ? <img className="overlapping-image" src="/playing-errors/hash.png"></img>
                    : state==3 && alreadySubmitted
                        ? <img className="overlapping-image" src="/playing-errors/choice.png"></img>
                        : <></>
        }
        
        <div className="flex-between w-full mb-16 pt-20">
            <button className={selectedChoice==="Rock" ? "image-highlighted" : "image-nothighlighted"} onClick={()=>{setSelectedChoice("Rock")}}>
                <Image 
                    src="/choices/rock.png"
                    alt="rock image"
                    width={150}
                    height={150}
                    className="object-contain m-5"
                />
            </button>
            <button className={selectedChoice==="Paper" ? "image-highlighted" : "image-nothighlighted"} onClick={()=>{setSelectedChoice("Paper")}}>
            <Image 
                    src="/choices/paper.png"
                    alt="paper image"
                    width={150}
                    height={150}
                    className="object-contain m-5"
                />
            </button>
            <button className={selectedChoice==="Scissors" ? "image-highlighted" : "image-nothighlighted"} onClick={()=>{setSelectedChoice("Scissors")}}>
            <Image 
                    src="/choices/scissors.png"
                    alt="scissors image"
                    width={150}
                    height={150}
                    className="object-contain m-5"
                />
            </button>
        </div>
        <div className="text-center mb-10">
            <p className="mx-auto inline-block mr-5">Password to encrypt your choice:</p>
            <input className="mx-auto" ref={passwordValue} type="password" id="join" placeholder="password"></input>
        </div>
        {isExpired
            ? <button className="custom-button mx-auto" disabled>Submit hash</button>
            : state==2
                ? !isPlayer || alreadySubmitted
                    ? <button className="custom-button mx-auto" disabled>Submit hash</button>
                    : disabledButton
                        ? <button className="custom-button mx-auto" disabled>Submit hash</button>
                        : <button className="custom-button mx-auto" onClick={handleSendHash}>Submit hash</button>
                : state==3 
                    ? !isPlayer || alreadySubmitted
                        ? <button className="custom-button mx-auto" disabled>Submit choice</button>
                        : disabledButton
                            ? <button className="custom-button mx-auto" disabled>Submit choice</button>
                            : <button className="custom-button mx-auto" onClick={handleSendChoice}>Submit choice</button>
                    : <button className="custom-button mx-auto" disabled>Submit</button>
        }   
        
      </div>
    )
  }
  
  export default InteractionWindow