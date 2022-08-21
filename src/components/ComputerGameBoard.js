import React,{useState,useEffect, forwardRef, useImperativeHandle} from "react";

const ComputerGameBoard =forwardRef((props,ref)=>{
    
    // Passing props from parent component
    const {setTurns,start,winner,reset,shipsArray,alphabet,initialGameBoard,checkAllShipSunk}=props

    const [computerGrids,setComputerGrids]=useState([]);
    const [remainShip,setRemainShip]=useState(['battleship', 'carrier', 'destroyer', 'patrolBoat', 'submarine']);

    // Re-render screen
    useEffect(()=>{
        if(reset===true){
            setComputerGrids([])
            setRemainShip(['battleship', 'carrier', 'destroyer', 'patrolBoat', 'submarine'])
        }else{
            initialGameBoard(setComputerGrids)
        }
    },[reset]);

    // Call the function by Parent component
    useImperativeHandle(ref, () => ({
        computer_place_ships
    }));

    // Random place ships function
    const computer_place_ships=()=>{
        const newArr=[...computerGrids]
        let placedShipNumber=0
        for(;placedShipNumber<shipsArray.length;){
            const length=shipsArray[placedShipNumber].length
            const name=shipsArray[placedShipNumber].name
            // generate random integer between 0(not horizontal) and 1 (horizontal)
            const random_horizontal=Math.abs(Math.floor(Math.random()*2))
            const occupied_id=[]
            if (random_horizontal){
                // random integer between 0 and 9-ship length
                const random_row_index=Math.abs(Math.floor(Math.random()*9-length))
                const random_column_index=Math.abs(Math.floor(Math.random()*9))
                // push all grid id which will be occupied into array
                for(let i=random_row_index;i<random_row_index+length;i++){
                    occupied_id.push(`${alphabet[random_column_index]}${i}`)
                }
                // filter occupied object by id and check every id is/is not occupied by ship
                const occupied_object = newArr.filter(item=>occupied_id.includes(item.id))
                if(occupied_object.every(item=>item.ship_exist===null)){
                    occupied_object.map(item=>item.ship_exist=name)
                    placedShipNumber++
                }
            }else{
                const random_row_index=Math.abs(Math.floor(Math.random()*9))
                // random integer between 0 and 9-ship length
                const random_column_index=Math.abs(Math.floor(Math.random()*9-length))
                // push all grid id which will be occupied into array
                for(let i=random_column_index;i<random_column_index+length;i++){
                    occupied_id.push(`${alphabet[i]}${random_row_index}`)
                }
                // filter occupied object by id and check every id is/is not occupied by ship
                const occupied_object = newArr.filter(item=>occupied_id.includes(item.id))
                if(occupied_object.every(item=>item.ship_exist===null)){
                    occupied_object.map(item=>item.ship_exist=name)
                    placedShipNumber++
                }
            }
        }
        // return original array if position not fulfill the requirement
        setComputerGrids(newArr)
    };

    // Receive Attack from Player
    const receiveAttack=(event)=>{
        const location=(event.target.id)
        let newArr=[...computerGrids]
        newArr.map(item=>{
            if(item.id===location){
                return item.shot=true
            }
            return item
        })
        checkAllShipSunk(computerGrids,setRemainShip,"Player")
        setComputerGrids(newArr)
        setTurns(turn=>turn+1)
    }

    return(
        <div>
            <div className="computer-gameBoard">
                <ul className="remain-ship-list">
                    <p>Computer Board</p>
                    {remainShip?remainShip.map(element=>{
                    return <li>{element}</li>
                    }):null}
                </ul>
                <div className="gameBoard-container">
                    {computerGrids.map(grid=>{
                        return(
                            <button 
                            className={`${grid.shot} ${grid.ship_exist}`} 
                            //
                            style={{backgroundColor:grid.shot&&grid.ship_exist?"rgb(255, 130, 130)":"none"}}
                            id={`${grid.id}`} 
                            onClick={(event)=>{
                                if(!grid.shot && start===true && winner===null){
                                    receiveAttack(event)
                                }
                            }}
                            >{grid.shot&&grid.ship_exist?"X":null}</button>
                        )
                    })}
                </div>
            </div>
        </div>
    );


})

export default ComputerGameBoard;