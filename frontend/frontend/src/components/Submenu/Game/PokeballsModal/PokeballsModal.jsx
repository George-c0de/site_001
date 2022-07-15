import React from 'react';

// Images
import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg';

import './PokeballsModal.css';

export const PokeballsModal = ({ status, imageMain, cardBackground, handleStatusBalls }) => (
  <div className='pokeballs-modal'>
    <div className='pokeballs-card main' style={ { backgroundColor: cardBackground } }>
      <div className='pokeballs-card-status'>
        <div className="card-status-bar" data-status={ status }>
          <span className="card-status-bar-line"></span>
          <span className="card-status-bar-label">{ status }%</span>
        </div>
        <div className="card-status-balls" onClick={ handleStatusBalls }>
          <span data-status="100" className={ status === '100' ? 'show' : null }>
            <img src={ pokeball } alt=''/>
          </span>
          <span data-status="75" className={ status === '75' ? 'show' : null }>
            <img src={ pokeball } alt=''/>
          </span>
          <span data-status="50" className={ status === '50' ? 'show' : null }>
            <img src={ pokeball } alt=''/>
          </span>
          <span data-status="25" className={ status === '25' ? 'show' : null }>
            <img src={ pokeball } alt=''/>
          </span>
        </div>
      </div>
      <div className='pokeballs-card-info'>
        <img src={ imageMain } alt=''/>
        <span className="card-info-label">Refelrel Profit: <span>325.23$</span></span>
        <span className="card-info-label">Total Wins: <span>245.85$</span></span>
        <span className="card-info-button">Health</span>
      </div>
    </div>

    <div className='pokeballs-card inactive'>
      <div className='pokeballs-card-label'>
        <span>ACRIVATE</span>
        <span>15 USD</span>
      </div>
      <img src={ pokeball } className="pokeballs-card-ball" alt=''/>
    </div>

    <div className='pokeballs-card inactive'>
      <div className='pokeballs-card-label'>
        <span>ACRIVATE</span>
        <span>25 USD</span>
      </div>
      <img src={ pokeball } className="pokeballs-card-ball" alt=''/>
    </div>

    <div className='pokeballs-card inactive'>
      <img src={ pokeball } className="pokeballs-card-ball" alt=''/>
    </div>

    <div className='pokeballs-card inactive'>
      <img src={ pokeball } className="pokeballs-card-ball" alt=''/>
    </div>

    <div className='pokeballs-card inactive'>
      <img src={ pokeball } className="pokeballs-card-ball" alt=''/>
    </div>
  </div>
)
