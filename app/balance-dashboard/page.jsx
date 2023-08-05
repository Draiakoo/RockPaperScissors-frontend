"use client"

import "@styles/globals.css"
import { chains, supportedChains } from "@chains";
import Footer from "@components/Footer"
import { Web3Context } from "@context/Web3Context";
import {useContext, useState, useEffect, useRef} from "react"
import { contractAddress, abi } from "@constants";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3"
import Big from 'big.js';
import { useQuery, gql } from "@apollo/client"
import TransactionLogs from "@components/TransactionLogs";

export default function BalanceDashboard() {

  const queryDeposits = (user) => {
    return(
      gql`
      {
        deposits (
          where:{depositor:"${user}"},
          orderBy: blockTimestamp,
          orderDirection: desc
        ){
          amount
          blockTimestamp
        }
      }
  `
    )
  }

  const queryWithdraws = (user) => {
    return(
      gql`
      {
        withdraws (
          where:{withdrawer:"${user}"},
          orderBy: blockTimestamp,
          orderDirection: desc
        ){
          amount
          blockTimestamp
        }
      }
  `
    )
  }

  const queryBalanceLog = (user) => {
    return(
      gql`
      {
        balanceLogs (
          where:{user:"${user}"},
          orderBy: blockTimestamp,
          orderDirection: desc
        ){
          amount
          type
          gameId
          blockTimestamp
        }
      }
  `
    )
  }

  const [rerender, setRerender] = useState(false)

  const depositValue = useRef(null)
  const withdrawValue = useRef(null)

  const [depositDisabledButton, setDepositDisabledButton] = useState(false)
  const [withdrawDisabledButton, setWithdrawDisabledButton] = useState(false)

  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser },
  } = useContext(Web3Context)

  const {loading: loadingBalanceLog, error: errorBalanceLog, data: dataBalanceLog, refetch: refetchBalanceLog } = useQuery(queryBalanceLog(address))
  const {loading: loadingDeposits, error: errorDeposits, data: dataDeposits, refetch: refetchDeposits } = useQuery(queryDeposits(address))
  const {loading: loadingWithdraw, error: errorWithdraw, data: dataWithdraw, refetch: refetchWithdraw } = useQuery(queryWithdraws(address))

  useEffect(() => {
    refetchBalanceLog()
    refetchDeposits()
    refetchWithdraw()
  }, [rerender])

  const validateInput = (input) => {
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

  const handleDeposit = async () => {
    var value = depositValue.current.value
    var validInput = validateInput(value)
    if(validInput){
      const userBalance = Web3.utils.toWei(balance, 'ether');
      value = Web3.utils.toWei(value, 'ether');
      if(value>userBalance){
        validInput = false;
        toast.error("You does not have enough balance to deposit", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    if(validInput){
      const contract = new provider.eth.Contract(abi, contractAddress);
      try {
        toast.info("Executing transaction...", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setDepositDisabledButton(true)
        const transactionResponse = await contract.methods.deposit(address).send({from: address, value: value})
        toast.success("Transaction success", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setDepositDisabledButton(false)
        setTimeout(() => {setRerender(!rerender)}, 1000)
      } catch (error) {
        if(error.message==="Returned error: MetaMask Tx Signature: User denied transaction signature."){
          setDepositDisabledButton(false)
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
  }

  const handleWithdraw = async () => {
    var value = withdrawValue.current.value
    var validInput = validateInput(value)
    if(validInput){
      const balanceUser = Web3.utils.toWei(balanceGameUser, 'ether');
      value = Web3.utils.toWei(value, 'ether');
      if(new Big(value).gt(new Big(balanceUser))){
        validInput = false;
        toast.error("You does not have enough balance to withdraw", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    if(validInput){
      const contract = new provider.eth.Contract(abi, contractAddress);
      try {
        toast.info("Executing transaction...", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setWithdrawDisabledButton(true)
        const transactionResponse = await contract.methods.withdraw(value).send({from: address})
        toast.success("Transaction success", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setWithdrawDisabledButton(false)
        setTimeout(() => {setRerender(!rerender)}, 1000)
      } catch (error) {
        if(error.message==="Returned error: MetaMask Tx Signature: User denied transaction signature."){
          setWithdrawDisabledButton(false)
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
            Your balance dashboard
          </h1>
          <h3 className="ml-20 p-5 text-2xl font-bold">Your current balance: {balanceGameUser} ETH</h3>
          <div className="container-grid py-7 mb-10">
            <div className="text-center">
              <h4 className="mb-7 font-bold">Make a deposit</h4>
              <input placeholder="Amount to deposit in ETH" ref={depositValue} className="w-52 mb-3"></input>
              {
                depositDisabledButton
                  ? <button className="custom-button mx-auto" disabled>Deposit</button>
                  : <button className="custom-button mx-auto" onClick={handleDeposit}>Deposit</button>
              }
            </div>
            <div className="text-center">
              <h4 className="mb-7 font-bold">Withdraw funds</h4>
              <input placeholder="Amount to wihtdraw in ETH" ref={withdrawValue} className="w-52 mb-3" disabled={balanceGameUser==0}></input>
              {
                withdrawDisabledButton
                  ? <button className="custom-button mx-auto" disabled>Withdraw</button>
                  : <button className="custom-button mx-auto" onClick={handleWithdraw} disabled={balanceGameUser==0}>Withdraw</button>
              }
            </div>
          </div>
          <h3 className="ml-20 p-5 text-2xl font-bold">Your transaction log</h3>
          <TransactionLogs 
            loadingBalanceLog={loadingBalanceLog}
            errorBalanceLog={errorBalanceLog}
            dataBalanceLog={dataBalanceLog}
  
            loadingDeposits={loadingDeposits}
            errorDeposits={errorDeposits}
            dataDeposits={dataDeposits}
  
            loadingWithdraw={loadingWithdraw}
            errorWithdraw={errorWithdraw}
            dataWithdraw={dataWithdraw}
          />
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
