import React from 'react';
import { useNavigate } from 'react-router-dom';

// Images
import Logo from '../../Ảnh Pokemon Dự Trù/логотип.svg';
import Background from '../../assets/Bg-ball.svg';
import MainBackground from '../../Ảnh Pokemon Dự Trù/фон общий-min.svg';

const Startgame = () => {

  const navigate = useNavigate();

  const startGame = () => {
    navigate("/login");
  }

  return (
    <div className="background-start">
      {/*Put Image Background Here*/ }
      <img src={ Logo } className="logo-tokemon" alt=""/>

      <div className='backgrounds'>
        <img src={ MainBackground } className="main-background" alt=""/>
        <img src={ Background } className="background-blue" alt=""/>
      </div>


      <div className='start-button-container'>
        <span className="start-game" onClick={ startGame }>start</span>
      </div>
    </div>
  )
}

export default Startgame;
