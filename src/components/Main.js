import React,{ useRef, useState} from "react";
import ComputerGameBoard from "./ComputerGameBoard";
import PlayerGameBoard from "./PlayerGameBoard";
import '../styles/Main.scss'

const Main =()=>{

    // Initial Setup of Ship Array and alphabet for coordinate
    const shipsArray = [
        {name: 'carrier', length: 5},
        {name: 'battleship', length: 4},
        {name: 'destroyer', length: 3},
        {name: 'submarine', length: 3},
        {name: 'patrolBoat', length: 2},
    ];
    const alphabet="ABCDEFGHIJKMNOPQRSTUVWXYZ";

    const [turn,setTurn]=useState(0);
    const childRef = useRef(null);
    const [start,setStart]=useState(false);
    const [placedShipNumber,setPlacedShipNumber]=useState(0);
    const [winner,setWinner]=useState(null);
    const [reset,setReset]=useState(false);

    // Start the game
    const gameStart=()=>{
        // when user placed 5 ships, computer place ships and start the game
        if(placedShipNumber===5){
            setStart(start=>!start)
            childRef.current.computer_place_ships()
        }else{
            console.log(`You need to place ${shipsArray.at(placedShipNumber).name}`)
        }
    }

    // Reset the game
    const gameReset=()=>{
        // set turn to true to re-render the game board
        setReset(true)
        setTurn(0)
        setStart(false)
        setPlacedShipNumber(0)
    }

    // Setup game board
    const initialGameBoard=(setGrids)=>{
        for (let y=0;y<10;y++){
            for (let x=0;x<10;x++){
                // Push the object into array of object to setup the game board
                setGrids(grids=>[...grids,{id:`${alphabet[y]}${[x]}`,ship_exist:null,shot:false}])
            }
        }
    };

    // Check all ships sunk
    const checkAllShipSunk=(grid,setRemainShip,opponent)=>{
        // filter all grid which is occupied by ship and not shot
        const ship_list=grid.filter(element=>element.ship_exist!==null && element.shot===false)
        // Remove all duplicate ships and sort by alphabet
        setRemainShip(Array.from(new Set(ship_list.map(element=>element.ship_exist))).sort()) 
        // If the all grid with ship length is 0, all ships are sunk and opponent win
        if (ship_list.length===0){
            setWinner(`${opponent} Win!`)
        }
    };

    return(
        <div className="display-container">
            <h1>Battleship</h1>
            {winner?<h2>{winner}</h2>:null}
            {start?null:<button className="game-btn" onClick={()=>{gameStart()}}>Start Game</button>}
            {winner?<button className="game-btn" onClick={()=>{gameReset()}}>Restart</button>:null}
            <div className="main-container">
                <PlayerGameBoard 
                turn={turn} 
                setTurns={setTurn} 
                start={start} 
                placedShipNumber={placedShipNumber} 
                setPlacedShipNumber={setPlacedShipNumber} 
                setWinner={setWinner}
                winner={winner}
                reset={reset}
                setReset={setReset}
                shipsArray={shipsArray}
                alphabet={alphabet}
                initialGameBoard={initialGameBoard}
                checkAllShipSunk={checkAllShipSunk}/>
                <ComputerGameBoard 
                ref={childRef} 
                turn={turn} 
                setTurns={setTurn} 
                start={start} 
                setWinner={setWinner}
                winner={winner}
                reset={reset}
                shipsArray={shipsArray}
                alphabet={alphabet}
                initialGameBoard={initialGameBoard}
                checkAllShipSunk={checkAllShipSunk}/>
            </div>
        </div>    
    )
}

export default Main;