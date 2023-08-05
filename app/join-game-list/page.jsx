"use client"

import GameList from "@components/GameList"
import "@styles/globals.css"
import { FaSearch } from "react-icons/fa"
import Combobox from "@components/Combobox"
import Footer from "@components/Footer"
import { formatDate } from "@dateHelper"
import CardCarousel from "@components/CardCarousel"
import { useQuery, gql } from "@apollo/client"
import { Web3Context } from "@context/Web3Context";
import {useContext, useState, useEffect, useRef} from "react"
import Web3 from "web3"
import { chains, supportedChains } from "@chains";


export default function JoinGame() {

  const queryJoinableGamesNoReservedNoFilter = (currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "0x0000000000000000000000000000000000000000", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesNoReservedGameId = (currentTimestamp, gameId) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "0x0000000000000000000000000000000000000000", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            gameId: "${gameId}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesNoReservedCreator = (creator, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "0x0000000000000000000000000000000000000000", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            creator: "${creator}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesNoReservedBetAmount = (currentTimestamp, betAmountLowerLimitIncluding, betAmountAmountUpperLimit) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "0x0000000000000000000000000000000000000000", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            betAmount_gte: "${betAmountLowerLimitIncluding}",
            betAmount_lt: "${betAmountAmountUpperLimit}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesNoReservedExpirationDate = (currentTimestamp, expirationDateLowerLimitIncluding, expirationDateAmountUpperLimit) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "0x0000000000000000000000000000000000000000", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            expirationDate_gte: "${expirationDateLowerLimitIncluding}",
            expirationDate_lt: "${expirationDateAmountUpperLimit}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesReservedNoFilter = (user, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "${user}", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesReservedGameId = (user, currentTimestamp, gameId) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "${user}", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            gameId: "${gameId}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesReservedCreator = (user, creator, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "${user}", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            creator: "${creator}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesReservedBetAmount = (user, currentTimestamp, betAmountLowerLimitIncluding, betAmountAmountUpperLimit) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "${user}", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            betAmount_gte: "${betAmountLowerLimitIncluding}",
            betAmount_lt: "${betAmountAmountUpperLimit}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const queryJoinableGamesReservedExpirationDate = (user, currentTimestamp, expirationDateLowerLimitIncluding, expirationDateAmountUpperLimit) => {
    return(
      gql`
      {
        stateOfGames (where: 
          { player2: "${user}", 
            state: 1,
            expirationDate_gt: "${currentTimestamp}",
            expirationDate_gte: "${expirationDateLowerLimitIncluding}",
            expirationDate_lt: "${expirationDateAmountUpperLimit}"
          }){
          gameId
          creator
          player2
          betAmount
          expirationDate
          state
          winner
          blockTimestamp
        }
      }
  `
    )
  }

  const {state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser }} = useContext(Web3Context)

  const [queryJoinableGames, setQueryJoinableGames] = useState(queryJoinableGamesNoReservedNoFilter(0))
  const [queryReservedGames, setQueryReservedGames] = useState(queryJoinableGamesReservedNoFilter(address, 0))

  const {loading: loadingJoinableGames, error: errorJoinableGames, data: dataJoinableGames} = useQuery(queryJoinableGames)
  const {loading: loadingReservedGames, error: errorReservedGames, data: dataReservedGames} = useQuery(queryReservedGames)

  const [currentBlockTimestamp, setCurrentBlockTimestamp] = useState("0")

  const fromDate1 = useRef("0");
  const toDate1 = useRef("0");
  const fromBet1 = useRef("0");
  const toBet1 = useRef("0");

  const fromDate2 = useRef("0");
  const toDate2 = useRef("0");
  const fromBet2 = useRef("0");
  const toBet2 = useRef("0");

  const [fromDateValue1, setFromDateValue1] = useState("");
  const [toDateValue1, setToDateValue1] = useState("");
  const [fromBetValue1, setFromBetValue1] = useState("");
  const [toBetValue1, setToBetValue1] = useState("");

  const [fromDateValue2, setFromDateValue2] = useState("");
  const [toDateValue2, setToDateValue2] = useState("");
  const [fromBetValue2, setFromBetValue2] = useState("");
  const [toBetValue2, setToBetValue2] = useState("");

  const [searchInput1, setSearchInput1] = useState("");
  const [searchInput2, setSearchInput2] = useState("");
  const [selected1, setSelected1] = useState("Select a filter");
  const [selected2, setSelected2] = useState("Select a filter");


  const handleInputChangeFrom1 = () => {
    setFromDateValue1(fromDate1.current.value)
  }

  const handleInputChangeTo1 = () => {
    setToDateValue1(toDate1.current.value)
  }

  const handleInputChangeFromBet1 = () => {
    setFromBetValue1(fromBet1.current.value)
  }

  const handleInputChangeToBet1 = () => {
    setToBetValue1(toBet1.current.value)
  }

  const handleInputChangeFrom2 = () => {
    setFromDateValue2(fromDate2.current.value)
  }

  const handleInputChangeTo2 = () => {
    setToDateValue2(toDate2.current.value)
  }

  const handleInputChangeFromBet2 = () => {
    setFromBetValue2(fromBet2.current.value)
  }

  const handleInputChangeToBet2 = () => {
    setToBetValue2(toBet2.current.value)
  }

  const handleChange1 = (value) => {
    setSearchInput1(value);
  };

  const handleChange2 = (value) => {
    setSearchInput2(value);
  };

  useEffect(() => {
    const getCurrentTimestamp = async () => {
      const currentBlock = await provider.eth.getBlock("latest");
      setCurrentBlockTimestamp(currentBlock.timestamp)
    }
    if(provider){
      getCurrentTimestamp()
    }
  }, [provider])

  useEffect(() => {
    if(selected1==="Select a filter"){
      setQueryReservedGames(queryJoinableGamesReservedNoFilter(address, currentBlockTimestamp))
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
      setSearchInput1("")
    } else if(selected1==="Game id"){
      if(searchInput1===""){
        setQueryReservedGames(queryJoinableGamesReservedNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryReservedGames(queryJoinableGamesReservedGameId(address, currentBlockTimestamp, searchInput1))
      }
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
    } else if(selected1==="Creator address"){
      if(searchInput1===""){
        setQueryReservedGames(queryJoinableGamesReservedNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryReservedGames(queryJoinableGamesReservedCreator(address, searchInput1, currentBlockTimestamp))
      }
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
    } else if(selected1==="Bet amount"){
      if(fromBetValue1==="" || toBetValue1===""){
        setQueryReservedGames(queryJoinableGamesReservedNoFilter(address, currentBlockTimestamp))
      } else {
        try {
          const lowerValue = Web3.utils.toWei(fromBetValue1, 'ether')
          const upperValue = Web3.utils.toWei(toBetValue1, 'ether')
          setQueryReservedGames(queryJoinableGamesReservedBetAmount(address, currentBlockTimestamp, lowerValue, upperValue))
        } catch (error) {
          console.log(error)
        }
        
      }
      setSearchInput1("")
      setFromDateValue1("")
      setToDateValue1("")
    } else if(selected1==="Expiration date"){
      if(fromDateValue1==="" || toDateValue1===""){
        setQueryReservedGames(queryJoinableGamesReservedNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryReservedGames(queryJoinableGamesReservedExpirationDate(address, currentBlockTimestamp, fromDateValue1, toDateValue1))
      }
      setSearchInput1("")
      setFromBetValue1("")
      setToBetValue1("")
    }
  }, [address, selected1, searchInput1, fromBetValue1, toBetValue1, fromDateValue1, toDateValue1, currentBlockTimestamp])

  useEffect(() => {
    if(selected2==="Select a filter"){
      setQueryJoinableGames(queryJoinableGamesNoReservedNoFilter(currentBlockTimestamp))
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
      setSearchInput2("")
    } else if(selected2==="Game id"){
      if(searchInput2===""){
        setQueryJoinableGames(queryJoinableGamesNoReservedNoFilter(currentBlockTimestamp))
      } else {
        setQueryJoinableGames(queryJoinableGamesNoReservedGameId(currentBlockTimestamp, searchInput2))
      }
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Creator address"){
      if(searchInput2===""){
        setQueryJoinableGames(queryJoinableGamesNoReservedNoFilter(currentBlockTimestamp))
      } else {
        setQueryJoinableGames(queryJoinableGamesNoReservedCreator(searchInput2, currentBlockTimestamp))
      }
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Bet amount"){
      if(fromBetValue2==="" || toBetValue2===""){
        setQueryJoinableGames(queryJoinableGamesNoReservedNoFilter(currentBlockTimestamp))
      } else {
        try {
          const lowerValue = Web3.utils.toWei(fromBetValue2, 'ether')
          const upperValue = Web3.utils.toWei(toBetValue2, 'ether')
          setQueryJoinableGames(queryJoinableGamesNoReservedBetAmount(currentBlockTimestamp, lowerValue, upperValue))
        } catch (error) {
          console.log(error)
        }
        
      }
      setSearchInput2("")
      setFromDateValue2("")
      setToDateValue2("")
    } else if(selected2==="Expiration date"){
      if(fromDateValue2==="" || toDateValue2===""){
        setQueryJoinableGames(queryJoinableGamesNoReservedNoFilter(currentBlockTimestamp))
      } else {
        setQueryJoinableGames(queryJoinableGamesNoReservedExpirationDate(currentBlockTimestamp, fromDateValue2, toDateValue2))
      }
      setSearchInput2("")
      setFromBetValue2("")
      setToBetValue2("")
    }
  }, [address, selected2, searchInput2, fromBetValue2, toBetValue2, fromDateValue2, toDateValue2, currentBlockTimestamp])


  if(supportedChains.includes(chains[currentChainId])){
    return (
      <>
          <h1 className="text-center underline p-5 text-4xl font-bold">
            Join a Game
          </h1>
          <h3 className="pl-10 pb-3">
            Your game invitations:
          </h3>
          {/* Combobox */}
          <Combobox selected={selected1} setSelected={setSelected1} options={["Select a filter", "Game id", "Creator address", "Bet amount", "Expiration date"]}/>
            {/* Search bar */}
            {(selected1=="Game id" || selected1=="Creator address") ? 
            <div className="input-wrapper w-4/12 ml-10 my-7">
              <FaSearch id="search-icon" />
              <input
                className="search-input"
                placeholder="Type to search..."
                value={searchInput1}
                onChange={(e) => handleChange1(e.target.value)}
              />
            </div> 
            : selected1==="Expiration date"
              ? <div className="ml-10 my-5">
                <span>Between</span>
                <input ref={fromDate1} type="number" className="mx-3" onChange={handleInputChangeFrom1}></input>
                <span className="mr-10">{formatDate(parseInt(fromDateValue1))}</span>
                <input ref={toDate1} type="number" className="mx-3" onChange={handleInputChangeTo1}></input>
                <span className="mr-10">{formatDate(parseInt(toDateValue1))}</span>
              </div>
              : selected1==="Bet amount"
                ? <div className="ml-10 my-5">
                <span>Between</span>
                <input ref={fromBet1} className="mx-3" onChange={handleInputChangeFromBet1}></input>
                <span>and</span>
                <input ref={toBet1} className="mx-3" onChange={handleInputChangeToBet1}></input>
              </div>
                : <></>
            }
          {loadingReservedGames
            ? <div className="my-36 text-center">Loading your reserved games</div>
            : errorReservedGames
              ? <div className="my-36 text-center">An error ocurred getting your reserved games</div>
              : dataReservedGames["stateOfGames"].length === 0
                ? <div className="my-36 text-center">You do not have any reserved game</div>
                : <CardCarousel cards={dataReservedGames["stateOfGames"]} buttonText={"Join game"} buttonColor={"green"} type={"Join game"} address={address}/>
          }
  
          <h3 className="pl-10 pb-3 pt-20">
            Joinable games for everyone:
          </h3>
            {/* Combobox */}
          <Combobox selected={selected2} setSelected={setSelected2} options={["Select a filter", "Game id", "Creator address", "Bet amount", "Expiration date"]}/>
            {/* Search bar */}
            {(selected2=="Game id" || selected2=="Creator address") ? 
            <div className="input-wrapper w-4/12 ml-10 my-7">
              <FaSearch id="search-icon" />
              <input
                className="search-input"
                placeholder="Type to search..."
                value={searchInput2}
                onChange={(e) => handleChange2(e.target.value)}
              />
            </div> 
            : selected2==="Expiration date"
              ? <div className="ml-10 my-5">
                <span>Between</span>
                <input ref={fromDate2} type="number" className="mx-3" onChange={handleInputChangeFrom2}></input>
                <span className="mr-10">{formatDate(parseInt(fromDateValue2))}</span>
                <input ref={toDate2} type="number" className="mx-3" onChange={handleInputChangeTo2}></input>
                <span className="mr-10">{formatDate(parseInt(toDateValue2))}</span>
              </div>
              : selected2==="Bet amount"
                ? <div className="ml-10 my-5">
                <span>Between</span>
                <input ref={fromBet2} className="mx-3" onChange={handleInputChangeFromBet2}></input>
                <span>and</span>
                <input ref={toBet2} className="mx-3" onChange={handleInputChangeToBet2}></input>
              </div>
                : <></>
            }
          
  
          {loadingJoinableGames
            ? <div className="my-36 text-center">Loading all joinable games</div>
            : errorJoinableGames
              ? <div className="my-36 text-center">An error ocurred getting all joinable games</div>
              : dataJoinableGames["stateOfGames"].length === 0
                ? <div className="my-36 text-center">There are no joinable games</div>
                : <CardCarousel cards={dataJoinableGames["stateOfGames"]} buttonText={"Join game"} buttonColor={"green"} type={"Join game"} address={address}/>
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
