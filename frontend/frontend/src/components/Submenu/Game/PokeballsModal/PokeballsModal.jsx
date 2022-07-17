import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Images
import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg';

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import './PokeballsModal.css';

const CardOpened = ({ image, background }) => {
  const [status, setStatus] = useState('25');

  const handleStatusBalls = (e) => {
    const statusBall = e.target.closest('[data-status]');
    if (statusBall) {
      statusBall.classList.toggle('show');
      setStatus(statusBall.dataset.status);
    }
  }

  return (
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
}

const CardClosed = ({ price, buyCard, idCard }) => {
  const [status, setStatus] = useState();

  const handleBuyClick = () => {
    setStatus('pending');

    setTimeout(async () => {
      await axios.get(`http://localhost:3000/api/bronze/${ idCard }`)
        .then((res) => {
          setStatus('success')

          setTimeout(() => {
            buyCard();
          }, 1000)
        })
    }, 3000)
  }

  return (
    <div>
      <div className='pokeballs-card-label' onClick={ handleBuyClick }>
        { status === 'pending' ?
          <span className='status_pending'></span> :
          status === 'success' ?
            (
              <span className='status_success'>
                <FontAwesomeIcon icon={ faCheck } className="status_success_check"/>
              </span>
            ) :
            (
              <>
                <span>ACRIVATE</span>
                <span>{ price } USD</span>
              </>
            )
        }
      </div>
      <img src={ pokeball } className="pokeballs-card-ball" alt=''/>
    </div>
  )
}

export const PokeballsModal = ({ amount, images, background }) => {
  const [cards, setCards] = useState([]);

  const buyCard = async (id) => {
    const newCards = [...cards];
    newCards[id - 1] = id;
    setCards(newCards)
  }

  useEffect(() => {
    const array = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < amount.length; i++) {
      array[amount[i] - 1] = amount[i]
    }

    setCards(array);
  }, [])

  return (
    <div className='pokeballs-modal'>
      {
        cards.map((id, i) => {
          return (
            <div data-id={ i + 1 } className={ id ? 'pokeballs-card opened' : 'pokeballs-card inactive' }>
              { id ?
                <CardOpened image={ images[i] } background={ background }/> :
                <CardClosed price='15' buyCard={ () => buyCard(i + 1) } idCard={ id }/>
              }
            </div>
          )
        })
      }
    </div>
  )
}
