import React,{useState,useEffect} from "react";


const Main =(props)=>{

    // Passing props from parent component
    const {turn,setTurns,start,placedShipNumber,setPlacedShipNumber,setWinner,winner,reset,setReset,shipsArray,alphabet,initialGameBoard,checkAllShipSunk}=props

    const [playerGrids,setPlayerGrids]=useState([]);
    const [allowToPlaceShip,setAllowToPlaceShip]=useState(false);
    const [horizontal,setHorizontal]=useState(true);
    const [remainShip,setRemainShip]=useState(['battleship', 'carrier', 'destroyer', 'patrolBoat', 'submarine']);
    
    // Re-render screen
    useEffect(()=>{
        // when user press reset and winner exists, reset Player Gameboard
        if(reset && winner){
            setRemainShip(['battleship', 'carrier', 'destroyer', 'patrolBoat', 'submarine'])
            setPlayerGrids([])
            setReset(false)
            setWinner(null)
            initialGameBoard(setPlayerGrids)
        }
        // Initial Setup of Player Gameboard
        else if(turn===0&&reset===false){
            initialGameBoard(setPlayerGrids)
        }
        // Computer random attack
        else if(turn%2!==0&& reset===false){
            random_attack()
            setTurns(turn=>turn+1)
        }
    },[turn]);

    // Random Attack by Computer
    const random_attack=()=>{
        let newArr=[...playerGrids]
        // filter all grid without shot
        const avaliable_list=playerGrids.filter(element=>element.shot===false)
        // check available list length
        if(avaliable_list.length){
            // random integer between 0 and available list length
            const random=Math.abs(Math.floor(Math.random()*avaliable_list.length))
            // obtain the random object id
            let shotting_position=avaliable_list[random].id
            // shot the random object id
            const target=newArr.find(element=>element.id===shotting_position)
            target.shot=true
            setPlayerGrids(newArr)
            checkAllShipSunk(playerGrids,setRemainShip,"Computer")
        }
        else{
            setWinner("Draw!")
        }
    };

    // Validation of the ship position
    const ship_position_validation=(row_index,column_index,shipsArray,placedShipNumber)=>{
        const length=shipsArray[placedShipNumber].length
        const name=shipsArray[placedShipNumber].name
        const newArr=[...playerGrids]
        const occupied_id=[]
        // if row index + length bigger than 10, the ship is longer than row number
        if(row_index+length<11 & horizontal===true){
            // push all grid id which will be occupied into array
            for(let i=row_index;i<row_index+length;i++){
                occupied_id.push(`${alphabet[column_index]}${i}`)
            }
            // filter occupied object by id and check every id is/is not occupied by ship
            const occupied_object = newArr.filter(item=>occupied_id.includes(item.id))
            if(occupied_object.every(item=>item.ship_exist===null)){
                // modify the newArr
                occupied_object.map(item=>item.ship_exist=name)
                setAllowToPlaceShip(true)
                return newArr
            }else{
                // if cannot place ship, return original array
                setAllowToPlaceShip(false)
                return newArr
            }
        }
        // if column index + length bigger than 10, the ship is longer than column number
        else if(column_index+length<11 & horizontal===false){
            // push all grid id which will be occupied into array
            for(let i=column_index;i<column_index+length;i++){
                occupied_id.push(`${alphabet[i]}${row_index}`)
            }
            // filter occupied object by id and check every id is/is not occupied by ship
            const occupied_object = newArr.filter(item=>occupied_id.includes(item.id))
            if(occupied_object.every(item=>item.ship_exist===null)){
                // modify the newArr
                occupied_object.map(item=>item.ship_exist=name)
                setAllowToPlaceShip(true)
                return newArr
            }else{
                // if cannot place ship, return original array
                setAllowToPlaceShip(false)
                return newArr
            }
        }
        else{
            // if cannot place ship, return original array
            setAllowToPlaceShip(false)
            return newArr
        }
    };

    // Mouse On Click button grid (Place ship)
    const placeShip=(event,shipsArray,placedShipNumber)=>{
        const location=(event.target.id)
        const row_index=parseInt(location.slice(1))
        const column_index=alphabet.indexOf(location.slice(0,1))
        const validation_result = ship_position_validation(row_index,column_index,shipsArray,placedShipNumber)
        setPlayerGrids(validation_result)
        // If allow to place ship, change to next ship 
        if(allowToPlaceShip){
            setPlacedShipNumber(prevState => prevState + 1)
            setAllowToPlaceShip(false)
        }
    };

    // Mouse hover the button grid (not place ship)
    const mouseOverShipLocation=(event,shipsArray,placedShipNumber)=>{
        const location=(event.target.id)
        const row_index=parseInt(location.slice(1))
        const column_index=alphabet.indexOf(location.slice(0,1))
        const validation_result = ship_position_validation(row_index,column_index,shipsArray,placedShipNumber)
        setPlayerGrids(validation_result)
    };

    // Mouse leave the button grid (not place ship)
    const mouseLeaveshiplocation=(event,shipsArray,placedShipNumber)=>{
        const name=shipsArray[placedShipNumber].name
        const newArr=[...playerGrids]
        newArr.map(item=>{
            if(item.ship_exist===name){
                return item.ship_exist=null
            }    
            return null
        })
        setPlayerGrids(newArr)
    };

    // Reset the Player Gameboard
    const reset_ships_position=()=>{
        setPlayerGrids([])
        setPlacedShipNumber(0)
        initialGameBoard(setPlayerGrids)
    };

    return(
        <div>
            <div className="player-gameBoard">
                <ul className="remain-ship-list">
                    <p>Your Board</p>
                    {remainShip?remainShip.map(element=>{
                    return <li>{element}</li>
                    }):null}
                </ul>
                <div className="container">
                <div className="gameBoard-container">
                    {playerGrids.map(grid=>{
                        return(
                            <button 
                            className={`${grid.shot} ${grid.ship_exist}`} 
                            id={`${grid.id}`} 
                            onMouseOver={(event)=>{
                                if(placedShipNumber<5){
                                    mouseOverShipLocation(event,shipsArray,placedShipNumber)
                                }
                            }}
                            onMouseLeave={(event)=>{
                                if(placedShipNumber<5){
                                    mouseLeaveshiplocation(event,shipsArray,placedShipNumber)
                                }
                            }}
                            onClick={(event)=>{
                                if(placedShipNumber<5 && winner===null){
                                    placeShip(event,shipsArray,placedShipNumber)
                                }
                            }}
                            >{grid.shot&&grid.ship_exist?"X":null}</button>
                        )
                    })}
                </div>
                <div className="btn-group">
                {start?null:<button onClick={()=>{setHorizontal(horizontal=>!horizontal)}}>Change Direction</button>}
                {start?null:<button onClick={()=>{reset_ships_position(shipsArray)}}>Reset</button>}
                </div>
                </div>
            </div>
        </div>
    );
}

export default Main;