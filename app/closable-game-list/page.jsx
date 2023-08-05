"use client"

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


export default function CloseGameList() {

  const queryClosableGamesNoFilter = (user, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {or: [
              { state: 1 },
              { state: 2 }
              ]},
            {expirationDate_lt: "${currentTimestamp}"}
          ]
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

  const queryClosableGamesGameId = (user, currentTimestamp, gameId) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {or: [
              { state: 1 },
              { state: 2 }
              ]},
            {gameId: "${gameId}"},
            {expirationDate_lt: "${currentTimestamp}"}
          ]
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

  const queryClosableGamesOpponent = (user, opponent, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {or: [
              { state: 1 },
              { state: 2 }
              ]},
            {or: [
              { creator: "${opponent}" },
              { player2: "${opponent}" }
            ]},
            {expirationDate_lt: "${currentTimestamp}"}
          ]
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

  const queryClosableGamesBetAmount = (user, betAmountLowerLimitIncluding, betAmountAmountUpperLimit, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {or: [
              { state: 1 },
              { state: 2 }
              ]},
            {betAmount_gte: "${betAmountLowerLimitIncluding}"},
            {betAmount_lt: "${betAmountAmountUpperLimit}"},
            {expirationDate_lt: "${currentTimestamp}"}
          ]
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

  const queryClosableGamesExpirationDate = (user, expirationDateLowerLimitIncluding, expirationDateAmountUpperLimit, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {or: [
              { state: 1 },
              { state: 2 }
              ]},
            {expirationDate_gte: "${expirationDateLowerLimitIncluding}"},
            {expirationDate_lt: "${expirationDateAmountUpperLimit}"},
            {expirationDate_lt: "${currentTimestamp}"}
          ]
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

  const [currentBlockTimestamp, setCurrentBlockTimestamp] = useState("0")

  const [queryClosableGames, setQueryClosableGames] = useState(queryClosableGamesNoFilter(address, currentBlockTimestamp))

  const {loading: loadingClosableGames, error: errorClosableGames, data: dataClosableGames} = useQuery(queryClosableGames)

  const fromDate1 = useRef("0");
  const toDate1 = useRef("0");
  const fromBet1 = useRef("0");
  const toBet1 = useRef("0");

  const [fromDateValue1, setFromDateValue1] = useState("");
  const [toDateValue1, setToDateValue1] = useState("");
  const [fromBetValue1, setFromBetValue1] = useState("");
  const [toBetValue1, setToBetValue1] = useState("");

  const [searchInput1, setSearchInput1] = useState("");
  const [selected1, setSelected1] = useState("Select a filter");


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

  const handleChange1 = (value) => {
    setSearchInput1(value);
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
      setQueryClosableGames(queryClosableGamesNoFilter(address, currentBlockTimestamp))
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
      setSearchInput1("")
    } else if(selected1==="Game id"){
      if(searchInput1===""){
        setQueryClosableGames(queryClosableGamesNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryClosableGames(queryClosableGamesGameId(address, currentBlockTimestamp, searchInput1))
      }
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
    } else if(selected1==="Opponent address"){
      if(searchInput1===""){
        setQueryClosableGames(queryClosableGamesNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryClosableGames(queryClosableGamesOpponent(address, searchInput1, currentBlockTimestamp))
      }
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
    } else if(selected1==="Bet amount"){
      if(fromBetValue1==="" || toBetValue1===""){
        setQueryClosableGames(queryClosableGamesNoFilter(address, currentBlockTimestamp))
      } else {
        try {
          const lowerValue = Web3.utils.toWei(fromBetValue1, 'ether')
          const upperValue = Web3.utils.toWei(toBetValue1, 'ether')
          setQueryClosableGames(queryClosableGamesBetAmount(address, lowerValue, upperValue, currentBlockTimestamp))
        } catch (error) {
          console.log(error)
        }
        
      }
      setSearchInput1("")
      setFromDateValue1("")
      setToDateValue1("")
    } else if(selected1==="Expiration date"){
      if(fromDateValue1==="" || toDateValue1===""){
        setQueryClosableGames(queryClosableGamesNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryClosableGames(queryClosableGamesExpirationDate(address, fromDateValue1, toDateValue1, currentBlockTimestamp))
      }
      setSearchInput1("")
      setFromBetValue1("")
      setToBetValue1("")
    }
  }, [address, selected1, searchInput1, fromBetValue1, toBetValue1, fromDateValue1, toDateValue1, currentBlockTimestamp])


  if(supportedChains.includes(chains[currentChainId])){
    return (
      <>
          <h1 className="text-center underline p-5 text-4xl font-bold">
            Close a Game
          </h1>
          <h3 className="pl-10 pb-3">
            Your closable games:
          </h3>
          {/* Combobox */}
          <Combobox selected={selected1} setSelected={setSelected1} options={["Select a filter", "Game id", "Opponent address", "Bet amount", "Expiration date"]}/>
            {/* Search bar */}
            {(selected1=="Game id" || selected1=="Opponent address") ? 
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
          {loadingClosableGames
            ? <div className="my-36 text-center">Loading your closable games</div>
            : errorClosableGames
              ? <div className="my-36 text-center">An error ocurred getting your closable games</div>
              : dataClosableGames["stateOfGames"].length === 0
                ? <div className="my-36 text-center">You do not have any closable game</div>
                : <CardCarousel cards={dataClosableGames["stateOfGames"]} buttonText={"Close game"} buttonColor={"green"} type={"Close game"} address={address}/>
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
