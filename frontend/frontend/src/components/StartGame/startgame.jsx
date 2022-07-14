import React from 'react';
import { useNavigate } from 'react-router-dom';

// Images
import Logo from '../../Ảnh Pokemon Dự Trù/логотип.svg';
import Background from '../../assets/Bg-ball.svg';
import MainBackground from '../../Ảnh Pokemon Dự Trù/фон общий-min.svg';
import axios from "axios";

const Startgame = () => {

  const navigate = useNavigate();
  let data2 = 200;
  let a = axios.get('http://127.0.0.1:8000/api/login')
      .catch(function (error){
    if (error.response) {
        data2 = error.response.status;
    }
      }
      );
  console.log(a)
  console.log(data2)
  const startGame = () => {
      if(data2===501){
            navigate("/home");
      }
      else{
          navigate("/login");
      }
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
