import React,{ useRef, useState} from "react";
import ComputerGameBoard from "./ComputerGameBoard";
import PlayerGameBoard from "./PlayerGameBoard";
import '../styles/Main.scss'

const Main =()=>{

    const shipsArray = [
        {name: 'carrier', length: 5},
        {name: 'battleship', length: 4},
        {name: 'destroyer', length: 3},
        {name: 'submarine', length: 3},
        {name: 'patrolBoat', length: 2},
    ];
    const alphabet="ABCDEFGHIJKMNOPQRSTUVWXYZ"

    const [turn,setTurn]=useState(0);
    const childRef = useRef(null);
    const [start,setStart]=useState(false);
    const [placedShipNumber,setPlacedShipNumber]=useState(0);
    const [winner,setWinner]=useState(null);
    const [reset,setReset]=useState(false)

    const gameStart=()=>{
        if(placedShipNumber===5){
            setStart(start=>!start)
            console.log(start)
            childRef.current.computer_place_ships()
        }else{
            console.log(`You need to place ${shipsArray.at(placedShipNumber).name}`)
        }
    }

    const gameReset=()=>{
        setReset(true)
        setTurn(0)
        setStart(false)
        setPlacedShipNumber(0)
        setWinner(null)
    }

    return(
        <div className="display-container">
            <h1>Battleship</h1>
            {winner?<h2>{winner}</h2>:null}
            {start?null:<button className="game-btn" onClick={()=>{gameStart()}}>Start Game</button>}
            {winner?<button className="game-btn" onClick={()=>{gameReset()}}>Reset</button>:null}
            <div className="main-container">
            <PlayerGameBoard 
            shipsArray={shipsArray} 
            turn={turn} 
            setTurns={setTurn} 
            start={start} 
            placedShipNumber={placedShipNumber} 
            setPlacedShipNumber={setPlacedShipNumber} 
            setWinner={setWinner}
            winner={winner}
            reset={reset}
            setReset={setReset}
            alphabet={alphabet}/>
            <ComputerGameBoard 
            ref={childRef} 
            turn={turn} 
            setTurns={setTurn} 
            start={start} 
            setWinner={setWinner}
            winner={winner}
            reset={reset}
            shipsArray={shipsArray}
            alphabet={alphabet}/>
            </div>

        </div>    
    )
}

export default Main;