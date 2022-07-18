import React, {useEffect, useState} from 'react';
import './GameHistory.css';
import Game from "../game";
import axios from "axios";



export const GameHistory = () => {

    const [data,setData]  = useState({ });
    useEffect(()=>{
        getUsername();
    },[])
    let getUsername = async () => {
        const res = await axios.get('http://127.0.0.1:8000/api/user')
        setData(res.data);
    }
    return (<>
  <div className="game-history">
    <span>GAME HISTORY</span>
    <div className='history-table'>
      <div className='history-table-row'>
        <span className="history-table-icon">()</span>
        <span className="history-table-time">22-00-B 12.06.2022</span>
        <span className="history-table-id">ID 525</span>
        <span className="history-table-score green">+ 7865</span>
      </div>
      <div className='history-table-row'>
        <span className="history-table-icon">()</span>
        <span className="history-table-time">22-00-B 12.06.2022</span>
        <span className="history-table-id">ID 525</span>
        <span className="history-table-score red">- 5674</span>
      </div>
      <div className='history-table-row'>
        <span className="history-table-icon">()</span>
        <span className="history-table-time">22-00-B 12.06.2022</span>
        <span className="history-table-id">ID 525</span>
        <span className="history-table-score green">+ 7865</span>
      </div>
    </div>
    <span className='game-history-more'>SHOW MORE</span>
  </div>
        </>
)
}