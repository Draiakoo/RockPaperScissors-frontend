"use client"
import ActionList from '@components/ActionList'
import Animation from '@components/Animation'
import "@styles/globals.css"
import { actionListNames, listsNames } from "@actionList"
import { Web3Context } from "../context/Web3Context";
import {useContext} from "react"
import { chains, supportedChains } from '@chains'
import Image from "next/image"


export default function Home() {

  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChainId, provider, balance, balanceGameUser },
  } = useContext(Web3Context);

  if(supportedChains.includes(chains[currentChainId])){
    return (
      <>
        <div className="container-grid py-7">
          <div className="my-auto px-12">
            <h1 className="text-center underline p-5 text-4xl font-bold">
              Rock Paper Scissors Game
            </h1>
            <p>Play the mythic rock, paper, scissors game securely with your friends or random people beting some ETH on-chain. The game works in 2 different phases: the first one to encrypt the choice of players with a secret password. And a second phase where the players have to reveal what did they choose by providing their password. Once both choices have been revealed, the winner get all the bet funds or if the game finishes as a tie, the players get their bet back</p>
          </div>
          <Animation/>
        </div>
        <h1 className="text-center">What to do?</h1>

        {/* Balance dashboard */}
        <div className="container-grid py-7 mb-10">
          <Image 
            src="/landing-images/balance-dashboard-landing.png"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl ml-16"
          />
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Balance dashboard
            </h1>
            <p>Deposit some ETH to get balance into the game or withdraw of your winnings! Check all the transaction log with its concept, the amount and the time it was executed</p>
          </div>
        </div>

        {/* Game creation */}
        <div className="container-grid py-7 mb-10">
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Game creation
            </h1>
            <p>Create a game by determining the amount to bet and the maximum duration of the game. You can create a lobby to play with a friend by awarding the spot for a specific address or open the lobby for everyone to join. You can also play for free by determining the bet amount to 0</p>
          </div>
          <Image 
            src="/landing-images/create-game-landing.png"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl mr-16"
          />
        </div>

        {/* Join a game */}
        <div className="container-grid py-7 mb-10">
          <Image 
            src="/landing-images/join-game-landing.jpg"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl ml-16"
          />
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Join a game
            </h1>
            <p>Check all the games that you can join. You can either join a game that you have been awarded a spot or join a lobby that is open for everyone</p>
          </div>
        </div>

        {/* Play the game */}
        <div className="container-grid py-7 mb-10">
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Play the game
            </h1>
            <p>Send your choice encrypted with the password on chain to generate the hash and wait for the opponent to do the same. Once both players have submited his hash, you can reveal what you chose by providing again your choice and the password</p>
          </div>
          <Image 
            src="/landing-images/play-game-landing.png"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl mr-16"
          />
        </div>

        {/* Check your game log */}
        <div className="container-grid py-7 mb-10">
          <Image 
            src="/landing-images/game-log-landing.jpg"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl ml-16"
          />
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Check your game log
            </h1>
            <p>You have here the list of your active game with its state to interact with. And the list of finished games that you already played with and its results to check if you either was the winner or the loser</p>
          </div>
        </div>

        {/* Cancel a game */}
        <div className="container-grid py-7 mb-10">
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Cancel a game
            </h1>
            <p>Have you created a game by accident? No worries, as long as the game has not been started (nobody joined) you can cancel the game getting your bet amount back</p>
          </div>
          <Image 
            src="/landing-images/cancel-game-landing.jpg"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl mr-16"
          />
        </div>

        {/* Close a game */}
        <div className="container-grid py-7 mb-10">
          <Image 
            src="/landing-images/close-game-landing.jpg"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl ml-16"
          />
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Close a game
            </h1>
            <p>Your opponent is not submiting his hash or revealing his choice? Do not worry, avoid the denial of service by closing the game once it expired its deadline and declaring the winner to the fair player</p>
          </div>
        </div>

        {/* Filter a game */}
        <div className="container-grid py-7 mb-10">
          <div className="my-auto px-20 ml-10">
            <h1 className="text-center underline p-5 text-3xl font-bold">
              Filter a game
            </h1>
            <p>Do you have a huge list of games? Filter from all the games of the lists with some parameters</p>
          </div>
          <Image 
            src="/landing-images/filter-landing.png"
            alt="paper image"
            width={700}
            height={150}
            className="rounded-lg shadow-2xl mr-16"
          />
        </div>
        <ActionList list1={actionListNames} list2={listsNames}/>
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
