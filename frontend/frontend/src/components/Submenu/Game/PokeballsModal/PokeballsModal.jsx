import React from 'react';

// Images
import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg';

import './PokeballsModal.css';

const CardOpened = ({ handleStatusBalls, image, background, status }) => (
  <>
    <img src={ background } alt='' className="card-background"/>
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
      <img src={ image } alt=''/>
      <span className="card-info-label">Refelrel Profit: <span>325.23$</span></span>
      <span className="card-info-label">Total Wins: <span>245.85$</span></span>
      <span className="card-info-button">Health</span>
    </div>
  </>
)

const CardClosed = ({ price }) => (
  <>
    <div className='pokeballs-card-label'>
      <span>ACRIVATE</span>
      <span>{ price } USD</span>
    </div>
    <img src={ pokeball } className="pokeballs-card-ball" alt=''/>
  </>
)

export const PokeballsModal = ({ status, handleStatusBalls, amount, images, background }) => (
  <div className='pokeballs-modal'>
    <div data-id='1' className={ 1 <= amount ? 'pokeballs-card opened' : 'pokeballs-card inactive' }>
      { 1 <= amount ? <CardOpened handleStatusBalls={ handleStatusBalls }
                                  image={ images[0] }
                                  background={ background }
                                  status={ status }/> :
        <CardClosed price='15'/> }
    </div>

    <div data-id='2' className={ 2 <= amount ? 'pokeballs-card opened' : 'pokeballs-card inactive' }>
      { 2 <= amount ? <CardOpened handleStatusBalls={ handleStatusBalls }
                                  image={ images[1] }
                                  background={ background }
                                  status={ status }/> :
        <CardClosed price='15'/> }
    </div>

    <div data-id='3' className={ 3 <= amount ? 'pokeballs-card opened' : 'pokeballs-card inactive' }>
      { 3 <= amount ? <CardOpened handleStatusBalls={ handleStatusBalls }
                                  image={ images[2] }
                                  background={ background }
                                  status={ status }/> :
        <CardClosed price='15'/> }
    </div>

    <div data-id='4' className={ 4 <= amount ? 'pokeballs-card opened' : 'pokeballs-card inactive' }>
      { 4 <= amount ? <CardOpened handleStatusBalls={ handleStatusBalls }
                                  image={ images[3] }
                                  background={ background }
                                  status={ status }/> :
        <CardClosed price='15'/> }
    </div>

    <div data-id='5' className={ 5 <= amount ? 'pokeballs-card opened' : 'pokeballs-card inactive' }>
      { 5 <= amount ? <CardOpened handleStatusBalls={ handleStatusBalls }
                                  image={ images[4] }
                                  background={ background }
                                  status={ status }/> :
        <CardClosed price='15'/> }
    </div>

    <div data-id='6' className={ 6 <= amount ? 'pokeballs-card opened' : 'pokeballs-card inactive' }>
      { 6 <= amount ? <CardOpened handleStatusBalls={ handleStatusBalls }
                                  image={ images[5] }
                                  background={ background }
                                  status={ status }/> :
        <CardClosed price='15'/> }
    </div>
  </div>
)
