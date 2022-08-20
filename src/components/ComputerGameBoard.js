import React,{useState,useEffect, forwardRef, useImperativeHandle} from "react";

const ComputerGameBoard =forwardRef((props,ref)=>{

    const {setTurns,start,setWinner,winner,reset,shipsArray,alphabet}=props

    const [computerGrids,setComputerGrids]=useState([]);
    const [remainShip,setRemainShip]=useState(['battleship', 'carrier', 'destroyer', 'patrolBoat', 'submarine']);

    useEffect(()=>{
        if(reset===true){
            setComputerGrids([])
            setRemainShip(['battleship', 'carrier', 'destroyer', 'patrolBoat', 'submarine'])
        }else{
            initialGameBoard(setComputerGrids)
        }
    },[reset]);

    useImperativeHandle(ref, () => ({
        computer_place_ships
    }));

    const initialGameBoard=(setGrids)=>{
        for (let y=0;y<10;y++){
            for (let x=0;x<10;x++){
                setGrids(grids=>[...grids,{id:`${alphabet[y]}${[x]}`,ship_exist:null,shot:false}])
            }
        }
    };

    const computer_place_ships=()=>{
        const newArr=[...computerGrids]
        console.log(computerGrids)
        let placedShipNumber=0
        for(;placedShipNumber<shipsArray.length;){
            const length=shipsArray[placedShipNumber].length
            const name=shipsArray[placedShipNumber].name
            const random_horizontal=Math.abs(Math.floor(Math.random()*2))
            const occupied_row=[]
            if (random_horizontal){
                const random_row_index=Math.abs(Math.floor(Math.random()*9-length))
                const random_column_index=Math.abs(Math.floor(Math.random()*9))
                for(let i=random_row_index;i<random_row_index+length;i++){
                    occupied_row.push(`${alphabet[random_column_index]}${i}`)
                }
                if(newArr.filter(item=>
                    occupied_row.includes(item.id)
                    ).every(item=>item.ship_exist===null)){
                    newArr.filter(item=>
                        occupied_row.includes(item.id)
                    ).map(item=>item.ship_exist=name)
                    placedShipNumber++
                }
            }else{
                const random_row_index=Math.abs(Math.floor(Math.random()*9))
                const random_column_index=Math.abs(Math.floor(Math.random()*9-length))
                for(let i=random_column_index;i<random_column_index+length;i++){
                    occupied_row.push(`${alphabet[i]}${random_row_index}`)
                }
                if(newArr.filter(item=>
                    occupied_row.includes(item.id)
                    ).every(item=>item.ship_exist===null)){
                    newArr.filter(item=>
                        occupied_row.includes(item.id)
                    ).map(item=>item.ship_exist=name)
                    placedShipNumber++
                }
            }
        }
        setComputerGrids(newArr)
    }

    const receiveAttack=(location)=>{
        let newArr=[...computerGrids]
        newArr.map(item=>{
            if(item.id===location){
                return item.shot=true
            }
            return item
        })
        checkAllShipSunk()
        setComputerGrids(newArr)
        setTurns(turn=>turn+1)
    }

    const attack=(event)=>{
        const location=(event.target.id)
        if(event.target.class!==false){
            receiveAttack(location)
        }
    }

    const checkAllShipSunk=()=>{
        const ship_list=computerGrids.filter(element=>element.ship_exist!==null && element.shot===false)
        setRemainShip(Array.from(new Set(ship_list.map(element=>element.ship_exist))).sort()) 
        console.log(remainShip)
        if (ship_list.length===0){
            setWinner("Player Win!")
        }
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
                            className={`${grid.shot} `} 
                            //${grid.ship_exist}
                            style={{backgroundColor:grid.shot&&grid.ship_exist?"rgb(255, 130, 130)":"none"}}
                            id={`${grid.id}`} 
                            onClick={(event)=>{
                                if(!grid.shot && start===true && winner===null){
                                    attack(event)
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