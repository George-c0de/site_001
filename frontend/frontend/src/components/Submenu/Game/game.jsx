//React, React Router, React Hooks
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Pages
import { Lang } from '../../MainPage/Lang/Lang';
import { Menu } from '../../MainPage/Menu/Menu';
import { UserId } from '../../UserId/UserId';
import { PokeballsPack } from './PokeballsPack/PokeballsPack';
import { GameHistory } from './GameHistory/GameHistory';

//Images
import { IMAGES } from './PokeballsModal/PokeballsImages';
import bronze from '../../../assets/backgrounds/бронза фон.svg';
import silver from '../../../assets/backgrounds/серебро-min.svg';
import gold from '../../../assets/backgrounds/золото-min.svg';
import emerald from '../../../assets/backgrounds/изумруд-min.svg';

import { t } from "ttag";
import axios from "axios";

const initialCardsAmount = {
  bronze: [0],
  silver: [0],
  gold: [0],
  emerald: [0]
}

const Game = () => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [onActive, setActive] = useState(true);
  const [cardsAmount, setCardsAmount] = useState(initialCardsAmount);

  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getCardData = async () => {
    try{
    await axios.get('http://127.0.0.1:8000/api/get_user_in_matrix')
      .then((data) => {
        const result = {
          bronze: data.bronze,
          silver: data.silver,
          gold: data.gold,
          emerald: data.emerald
        }
        console.log(result)
        console.log(cardsAmount)
        console.log(data)
        setCardsAmount(result);
      })
    }catch (e){
      console.log(e)
    }
  }

  useEffect(() => {
    getCardData();
    getUsername()
  }, [])

  let getUsername = async () => {
    const username = await axios.get('http://127.0.0.1:8000/api/user')
    console.log(username);
    setUsername(username.data.username);
  }

  //Show Menu
  const backHome = () => {
    navigate("/home");
  };

  //Show informations of user
  const showUserInfo = () => {
    if (!openDropDown) {
      setOpenUserInfo(!openUserInfo);
      setActive(!onActive);
    } else {
      setOpenUserInfo(!openUserInfo);
      setOpenDropDown(!openDropDown);
    }
  };

  return (
    <>
      {/*<h1>{ username }</h1>*/ }
      <div className="homepage">
        <div className="main_container">
          <nav className={ onActive ? "navbar" : "navbar_active" }>
            <Menu isActive={ onActive } showMenu={ backHome } showUserInfo={ showUserInfo }
                  handleLogout={ handleLogout }/>
            { openUserInfo ? <UserId/> : null }
          </nav>
        </div>

        <div className={ onActive ? "site-main-game" : "site-main_active" }>
          <div className='site-main-game-wrapper'>
            <div className="text-game">{ t`JOIN THE FIGHT AND WIN` }</div>

            <div className="container-pack-pokeballs">

              <PokeballsPack title={ 'BRONZE' }
                             amount={ cardsAmount.bronze }
                             images={ IMAGES.slice(0, 6) }
                             background={ bronze }/>
              <PokeballsPack title={ 'SILVER' }
                             amount={ cardsAmount.silver }
                             images={ IMAGES.slice(6, 12) }
                             background={ silver }/>
              <PokeballsPack title={ 'GOLD' }
                             amount={ cardsAmount.gold }
                             images={ IMAGES.slice(12, 18) }
                             background={ gold }/>
              <PokeballsPack title={ 'EMERALD' }
                             amount={ cardsAmount.emerald }
                             images={ IMAGES.slice(18, 24) }
                             background={ emerald }/>
            </div>

            <GameHistory/>

          </div>

          <Lang isActive={ onActive }/>
        </div>
      </div>
    </>
  );
};

export default Game;