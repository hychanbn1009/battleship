import React,{useState,useEffect,forwardRef,useImperativeHandle} from "react";


const Main =forwardRef((props,ref)=>{

    const {turn,setTurns,start,placedShipNumber,setPlacedShipNumber,setWinner,winner,reset,setReset,shipsArray,alphabet}=props

    const [playerGrids,setPlayerGrids]=useState([]);
    const [allowToPlaceShip,setAllowToPlaceShip]=useState(false);
    const [horizontal,setHorizontal]=useState(true);
    const [remainShip,setRemainShip]=useState(['battleship', 'carrier', 'destroyer', 'patrolBoat', 'submarine']);
    
    useEffect(()=>{
        if(turn===0&&reset===false){
            initialGameBoard(setPlayerGrids)
        }
        else if(turn%2!==0&& reset===false){
            random_attack()
            setTurns(turn=>turn+1)
        }
        else if(reset===true){
            setPlayerGrids([])
            initialGameBoard(setPlayerGrids)
            setReset(false)
        }
    },[turn]);

    const initialGameBoard=(setGrids)=>{
        for (let y=0;y<10;y++){
            for (let x=0;x<10;x++){
                setGrids(grids=>[...grids,{id:`${alphabet[y]}${[x]}`,ship_exist:null,shot:false}])
            }
        }
    };

    useImperativeHandle(ref, () => ({
        random_attack
    }));

    const random_attack=()=>{
        let newArr=[...playerGrids]
        const avaliable_list=playerGrids.filter(element=>element.shot===false)
        console.log(avaliable_list)
        if(avaliable_list.length){
            const random=Math.abs(Math.floor(Math.random()*avaliable_list.length))
            let shotting_position=avaliable_list[random].id
            console.log(shotting_position)
            const target=newArr.find(element=>element.id===shotting_position)
            target.shot=true
            setPlayerGrids(newArr)
            checkAllShipSunk()
        }
        else{
            setWinner("Draw!")
        }
    }


    const ship_position_validation=(row_index,column_index,shipsArray,placedShipNumber)=>{
        const length=shipsArray[placedShipNumber].length
        const name=shipsArray[placedShipNumber].name
        const newArr=[...playerGrids]
        const occupied_row=[]
        if(row_index+length<11 & horizontal===true){
            for(let i=row_index;i<row_index+length;i++){
                occupied_row.push(`${alphabet[column_index]}${i}`)
            }
            if(newArr.filter(item=>
                occupied_row.includes(item.id)
                ).every(item=>item.ship_exist===null)){
                newArr.filter(item=>
                    occupied_row.includes(item.id)
                ).map(item=>item.ship_exist=name)
                setAllowToPlaceShip(true)
                return newArr
            }else{
                setAllowToPlaceShip(false)
                return newArr
            }
        }
        else if(column_index+length<11 & horizontal===false){
            for(let i=column_index;i<column_index+length;i++){
                occupied_row.push(`${alphabet[i]}${row_index}`)
            }
            if(newArr.filter(item=>
                occupied_row.includes(item.id)
                ).every(item=>item.ship_exist===null)){
                newArr.filter(item=>
                    occupied_row.includes(item.id)
                ).map(item=>item.ship_exist=name)
                setAllowToPlaceShip(true)
                return newArr
            }else{
                setAllowToPlaceShip(false)
                return newArr
            }
        }
        else{
            setAllowToPlaceShip(false)
            return newArr
        }
    }

    const placeShip=(event,shipsArray,placedShipNumber)=>{
        const location=(event.target.id)
        const row_index=parseInt(location.slice(1))
        const column_index=alphabet.indexOf(location.slice(0,1))
        const validation_result = ship_position_validation(row_index,column_index,shipsArray,placedShipNumber)
        setPlayerGrids(validation_result)
        if(allowToPlaceShip){
            setPlacedShipNumber(prevState => prevState + 1)
            setAllowToPlaceShip(false)
        }
    }

    const mouseOverShipLocation=(event,shipsArray,placedShipNumber)=>{
        const location=(event.target.id)
        const row_index=parseInt(location.slice(1))
        const column_index=alphabet.indexOf(location.slice(0,1))
        const validation_result = ship_position_validation(row_index,column_index,shipsArray,placedShipNumber)
        setPlayerGrids(validation_result)
    }

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
    }

    const reset_ships_position=()=>{
        setPlayerGrids([])
        setPlacedShipNumber(0)
        initialGameBoard(setPlayerGrids)
    }


    const checkAllShipSunk=()=>{
        const ship_list=playerGrids.filter(element=>element.ship_exist!==null && element.shot===false)
        setRemainShip(Array.from(new Set(ship_list.map(element=>element.ship_exist))).sort()) 
        console.log(remainShip)
        if (ship_list.length===0){
            setWinner("Computer Win!")
        }
    }

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
})

export default Main;