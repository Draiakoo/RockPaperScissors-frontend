import Web3 from 'web3';
import { useCallback, useEffect, useState } from "react";
import { contractAddress, abi } from "../constants";
import { chains, supportedChains } from '@chains';

const useWeb3Provider = () => {

  const suppotedChains = [
    "Sepolia",
  ]

  const initialWeb3State = {
    address: null,
    currentChainId: null,
    signer: null,
    provider: null,
    balance: 0,
    balanceGameUser: 0,
    isAuthenticated: false,
  };

  const [state, setState] = useState(initialWeb3State);
  const [interv, setInterv] = useState(null);

  const getBalance = async () => {
    try {
      var balance =  await state.provider.eth.getBalance(state.address);
      balance = Web3.utils.fromWei(balance, 'ether')
      if(balance=="0."){
        balance="0"
      }
      const contract = new state.provider.eth.Contract(abi, contractAddress);
      const transactionResponse = await contract.methods.balanceOf(state.address).call({from: state.address})
      var balanceGameUser = Web3.utils.fromWei(transactionResponse, 'ether')
      if(balanceGameUser=="0."){
        balanceGameUser="0"
      }
      setState({ ...state, balance: balance, balanceGameUser: balanceGameUser });
    } catch (error) {
      // console.log(error);
      // setState({ ...state, balance: error, balanceGameUser: error  });
    }
  }

  useEffect(() => {
    if(!state.isAuthenticated || !supportedChains.includes(chains[state.currentChainId])){
      setState({ ...state, balance: -1, balanceGameUser: -1});
      if(interv){
        setInterv(clearInterval(interv))
      }
    } else {
      if(!interv){
        setInterv(setInterval(()=>{
          getBalance()
          },1000))
      }
    }
  }, [state.isAuthenticated, state.currentChainId])

  const connectWallet = useCallback(async () => {
    
    if (state.isAuthenticated) return;
    
    try {
      const provider = new Web3(window.ethereum);

      await window.ethereum.enable();

      try {
        await window.ethereum.enable();
      } catch (error) {
        if (error.message === 'User denied account authorization') {
          console.log('User denied account authorization');
        } else if (error.message === 'MetaMask is not enabled') {
          console.log('MetaMask is not enabled');
        }
      }
      const accounts = await provider.eth.getAccounts();

      if (accounts.length > 0) {
        const chain = Number(window.ethereum.chainId);
        const account = accounts[0];
        var balance =  await provider.eth.getBalance(account);
        balance = Web3.utils.fromWei(balance, 'ether');
        console.log("Changed chain from connectwallet")
        setState({
          ...state,
          address: account,
          signer: account,
          currentChainId: chain,
          provider: provider,
          balance: balance,
          isAuthenticated: true,
        });

        localStorage.setItem("isAuthenticated", "true");
      }
    } catch {}
  }, [state]);

  const disconnect = () => {
    setState(initialWeb3State);
    localStorage.removeItem("isAuthenticated");
  };

  useEffect(() => {
    if (window == null) return;

    if (localStorage.hasOwnProperty("isAuthenticated")) {
      connectWallet();
    }
  }, [connectWallet, state.isAuthenticated]);

  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    window.ethereum.on("accountsChanged", (accounts) => {
      setState({ ...state, address: accounts[0]});
    });

    window.ethereum.on("chainChanged", (network) => {
      const chain = Number(network);
      setInterv(clearInterval(interv))
      setState({ ...state, currentChainId: chain});
    });

  //   window.ethereum.on('disconnect', () => {
  //     console.log("Disconnected")
  //     disconnect();
  //  });

    return () => {
      window.ethereum.removeAllListeners();
    };
  }, [state]);

  return {
    connectWallet,
    disconnect,
    state,
  };
};

export default useWeb3Provider;