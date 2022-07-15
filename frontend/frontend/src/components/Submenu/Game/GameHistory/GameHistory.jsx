import React from 'react';
import './GameHistory.css';

export const GameHistory = () => (
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
)
