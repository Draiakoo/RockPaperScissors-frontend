"use client"

import "@styles/globals.css"
import { FaSearch } from "react-icons/fa"
import Combobox from "@components/Combobox"
import Footer from "@components/Footer"
import CardCarousel from "@components/CardCarousel"
import { formatDate } from "@dateHelper"
import { useQuery, gql } from "@apollo/client"
import { Web3Context } from "@context/Web3Context";
import {useContext, useState, useEffect, useRef} from "react"
import Web3 from "web3"
import { chains, supportedChains } from "@chains";



export default function GameLog() {

  const queryActiveGamesNoFilter = (creator, currentTimestamp) => {
    return(
      gql`
    {
      stateOfGames (where: 
        {and: [
          {or: [
          { creator: "${creator}" },
          { player2: "${creator}" }
          ]},
          {state: 2},
          {expirationDate_gt: "${currentTimestamp}"}
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

  const queryActiveGamesGameId = (creator, gameId, currentTimestamp) => {
    return(
      gql`
    {
      stateOfGames (where: 
        {and: [
          {or: [
          { creator: "${creator}" },
          { player2: "${creator}" }
          ]},
          {state: 2},
          {gameId: "${gameId}"},
          {expirationDate_gt: "${currentTimestamp}"}
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

  const queryActiveGamesOpponent = (creator, opponent, currentTimestamp) => {
    return(
      gql`
    {
      stateOfGames (where: 
        {and: [
          {or: [
          { creator: "${creator}" },
          { player2: "${creator}" }
          ]},
          {state: 2},
          {or: [
          { creator: "${opponent}" },
          { player2: "${opponent}" },
          {expirationDate_gt: "${currentTimestamp}"}
          ]}
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

  const queryActiveGamesBetAmount = (creator, betAmountLowerLimitIncluding, betAmountUpperLimit, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${creator}" },
            { player2: "${creator}" }
            ]},
            {state: 2},
            {betAmount_gte: "${betAmountLowerLimitIncluding}"},
            {betAmount_lt: "${betAmountUpperLimit}"},
            {expirationDate_gt: "${currentTimestamp}"}
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

  const queryActiveGamesExpirationDate = (creator, expirationDateLowerLimitIncluding, expirationDateAmountUpperLimit, currentTimestamp) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${creator}" },
            { player2: "${creator}" }
            ]},
            {state: 2},
            {expirationDate_gte: "${expirationDateLowerLimitIncluding}"},
            {expirationDate_lt: "${expirationDateAmountUpperLimit}"},
            {expirationDate_gt: "${currentTimestamp}"}
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

  const queryFinishedGamesNoFilter = (creator) => {
    return(
      gql`
    {
      stateOfGames (where: 
        {and: [
          {or: [
          { creator: "${creator}" },
          { player2: "${creator}" }
          ]},
          {state: 3}
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

  const queryFinishedGamesGameId = (creator, gameId) => {
    return(
      gql`
    {
      stateOfGames (where: 
        {and: [
          {or: [
          { creator: "${creator}" },
          { player2: "${creator}" }
          ]},
          {state: 3},
          {gameId: "${gameId}"},
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

  const queryFinishedGamesOpponent = (creator, opponent) => {
    return(
      gql`
    {
      stateOfGames (where: 
        {and: [
          {or: [
          { creator: "${creator}" },
          { player2: "${creator}" }
          ]},
          {state: 3},
          {or: [
          { creator: "${opponent}" },
          { player2: "${opponent}" }
          ]}
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

  const queryFinishedGamesBetAmount = (creator, betAmountLowerLimitIncluding, betAmountUpperLimit) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${creator}" },
            { player2: "${creator}" }
            ]},
            {state: 3},
            {betAmount_gte: "${betAmountLowerLimitIncluding}"},
            {betAmount_lt: "${betAmountUpperLimit}"}
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

  const queryFinishedGamesExpirationDate = (creator, expirationDateLowerLimitIncluding, expirationDateAmountUpperLimit) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${creator}" },
            { player2: "${creator}" }
            ]},
            {state: 3},
            {expirationDate_gte: "${expirationDateLowerLimitIncluding}"},
            {expirationDate_lt: "${expirationDateAmountUpperLimit}"}
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

  const queryFinishedGamesFinishingDate = (creator, finishingDateLowerLimitIncluding, finishingDateAmountUpperLimit) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${creator}" },
            { player2: "${creator}" }
            ]},
            {state: 3},
            {blockTimestamp_gte: "${finishingDateLowerLimitIncluding}"},
            {blockTimestamp_lt: "${finishingDateAmountUpperLimit}"}
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

  const queryFinishedGamesWinner = (creator, winner) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${creator}" },
            { player2: "${creator}" }
            ]},
            {state: 3},
            {winner: "${winner}"}
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

  const queryFinishedGamesWins = (user) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {state: 3},
            {winner: "${user}"}
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

  const queryFinishedGamesLoses = (user) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {state: 3},
            { winner_not: "${user}"},
            { winner_not: "0x0000000000000000000000000000000000000000"},
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

  const queryFinishedGamesTiesAndCancelled = (user) => {
    return(
      gql`
      {
        stateOfGames (where: 
          {and: [
            {or: [
            { creator: "${user}" },
            { player2: "${user}" }
            ]},
            {state: 3},
            {winner: "0x0000000000000000000000000000000000000000"}
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

  const [queryActiveGames, setQueryActiveGames] = useState(queryActiveGamesNoFilter(address, currentBlockTimestamp))
  const [queryFinishedGames, setQueryFinishedGames] = useState(queryFinishedGamesNoFilter(address))

  const {loading: loadingActiveGames, error: errorActiveGames, data: dataActiveGames} = useQuery(queryActiveGames)
  const {loading: loadingFinishedGames, error: errorFinishedGames, data: dataFinishedGames} = useQuery(queryFinishedGames)

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
      setQueryActiveGames(queryActiveGamesNoFilter(address, currentBlockTimestamp))
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
      setSearchInput1("")
    } else if(selected1==="Game id"){
      if(searchInput1===""){
        setQueryActiveGames(queryActiveGamesNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryActiveGames(queryActiveGamesGameId(address, searchInput1, currentBlockTimestamp))
      }
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
    } else if(selected1==="Opponent address"){
      if(searchInput1===""){
        setQueryActiveGames(queryActiveGamesNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryActiveGames(queryActiveGamesOpponent(address, searchInput1, currentBlockTimestamp))
      }
      setFromDateValue1("")
      setToDateValue1("")
      setFromBetValue1("")
      setToBetValue1("")
    } else if(selected1==="Bet amount"){
      if(fromBetValue1==="" || toBetValue1===""){
        setQueryActiveGames(queryActiveGamesNoFilter(address, currentBlockTimestamp))
      } else {
        try {
          const lowerValue = Web3.utils.toWei(fromBetValue1, 'ether')
          const upperValue = Web3.utils.toWei(toBetValue1, 'ether')
          setQueryActiveGames(queryActiveGamesBetAmount(address, lowerValue, upperValue, currentBlockTimestamp))
        } catch (error) {
          console.log(error)
        }
        
      }
      setSearchInput1("")
      setFromDateValue1("")
      setToDateValue1("")
    } else if(selected1==="Expiration date"){
      console.log(fromDateValue1, toDateValue1)
      if(fromDateValue1==="" || toDateValue1===""){
        setQueryActiveGames(queryActiveGamesNoFilter(address, currentBlockTimestamp))
      } else {
        setQueryActiveGames(queryActiveGamesExpirationDate(address, fromDateValue1, toDateValue1, currentBlockTimestamp))
      }
      setSearchInput1("")
      setFromBetValue1("")
      setToBetValue1("")
    }
  }, [address, selected1, searchInput1, fromBetValue1, toBetValue1, fromDateValue1, toDateValue1])

  useEffect(() => {
    if(selected2==="Select a filter"){
      setQueryFinishedGames(queryFinishedGamesNoFilter(address))
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
      setSearchInput2("")
    } else if(selected2==="Game id"){
      if(searchInput2===""){
        setQueryFinishedGames(queryFinishedGamesNoFilter(address))
      } else {
        setQueryFinishedGames(queryFinishedGamesGameId(address, searchInput2))
      }
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Opponent address"){
      if(searchInput2===""){
        setQueryFinishedGames(queryFinishedGamesNoFilter(address))
      } else {
        setQueryFinishedGames(queryFinishedGamesOpponent(address, searchInput2))
      }
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Winner address"){
      if(searchInput2===""){
        setQueryFinishedGames(queryFinishedGamesNoFilter(address))
      } else {
        setQueryFinishedGames(queryFinishedGamesWinner(address, searchInput2))
      }
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Bet amount"){
      if(fromBetValue2==="" || toBetValue2===""){
        setQueryFinishedGames(queryFinishedGamesNoFilter(address))
      } else {
        try {
          const lowerValue = Web3.utils.toWei(fromBetValue2, 'ether')
          const upperValue = Web3.utils.toWei(toBetValue2, 'ether')
          setQueryFinishedGames(queryFinishedGamesBetAmount(address, lowerValue, upperValue))
        } catch (error) {
          console.log(error)
        }
        
      }
      setSearchInput2("")
      setFromDateValue2("")
      setToDateValue2("")
    } else if(selected2==="Finishing date"){
      if(fromDateValue2==="" || toDateValue2===""){
        setQueryFinishedGames(queryFinishedGamesNoFilter(address))
      } else {
        setQueryFinishedGames(queryFinishedGamesFinishingDate(address, fromDateValue2, toDateValue2))
      }
      setSearchInput2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Wins"){
      setQueryFinishedGames(queryFinishedGamesWins(address))
      setSearchInput2("")
      setFromBetValue2("")
      setToBetValue2("")
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Loses"){
      setQueryFinishedGames(queryFinishedGamesLoses(address))
      setSearchInput2("")
      setFromBetValue2("")
      setToBetValue2("")
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    } else if(selected2==="Ties and cancelled games"){
      setQueryFinishedGames(queryFinishedGamesTiesAndCancelled(address))
      setSearchInput2("")
      setFromBetValue2("")
      setToBetValue2("")
      setFromDateValue2("")
      setToDateValue2("")
      setFromBetValue2("")
      setToBetValue2("")
    }
  }, [address, selected2, searchInput2, fromBetValue2, toBetValue2, fromDateValue2, toDateValue2])


  if(supportedChains.includes(chains[currentChainId])){
    return (
      <>
          <h1 className="text-center underline p-5 text-4xl font-bold">
            Your game log
          </h1>
          <h3 className="pl-10 pb-3">
            Your current games:
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
          {loadingActiveGames
            ? <div className="my-36 text-center">Loading your active games</div>
            : errorActiveGames
              ? <div className="my-36 text-center">An error ocurred getting your active games</div>
              : dataActiveGames["stateOfGames"].length === 0
                ? <div className="my-36 text-center">You do not have any active game</div>
                : <CardCarousel cards={dataActiveGames["stateOfGames"]} buttonText={"Play the game"} buttonColor={"yellow"} type={"Active game"} address={address}/>
          }
          
          <h3 className="pl-10 pb-3 pt-20">
            Your finished games:
          </h3>
          {/* Combobox */}
          <Combobox selected={selected2} setSelected={setSelected2} options={["Select a filter", "Game id", "Opponent address", "Winner address", "Bet amount", "Finishing date", "Wins", "Loses", "Ties and cancelled games"]}/>
            {/* Search bar */}
            {(selected2=="Game id" || selected2=="Opponent address" || selected2=="Winner address") ? 
            <div className="input-wrapper w-4/12 ml-10 my-7">
              <FaSearch id="search-icon" />
              <input
                className="search-input"
                placeholder="Type to search..."
                value={searchInput2}
                onChange={(e) => handleChange2(e.target.value)}
              />
            </div> 
            : selected2==="Finishing date"
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
  
          {/*  */}
          {loadingFinishedGames
            ? <div className="my-36 text-center">Loading your finished games</div>
            : errorFinishedGames
              ? <div className="my-36 text-center">An error ocurred getting your finished games</div>
              : dataFinishedGames["stateOfGames"].length === 0
                ? <div className="my-36 text-center">You do not have any finished game</div>
                : <CardCarousel cards={dataFinishedGames["stateOfGames"]} buttonText={"View information"} buttonColor={"blue"} type={"Finished game"} address={address}/>
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
