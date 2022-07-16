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

const apiMockData = {
  max_card: '36'
}

const indexToCard = {
  '0': 'bronze',
  '1': 'silver',
  '2': 'gold',
  '3': 'emerald',
}

const initialCardsAmount = {
  bronze: 0,
  silver: 0,
  gold: 0,
  emerald: 0
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

  const getCardData = () => {
    const index = (apiMockData.max_card - (apiMockData.max_card % 10)) / 10;
    const amount = apiMockData.max_card % 10;

    const result = {
      bronze: 0,
      silver: 0,
      gold: 0,
      emerald: 0
    }

    for (let i = 0; i <= index; i++) {
      if (i < index) {
        const category = indexToCard[i];
        result[category] = 6
      }
      if (i === index) {
        const category = indexToCard[i];
        result[category] = amount;
      }
    }

    setCardsAmount(result);
  }

  useEffect(() => {
    getUsername()
    getCardData();
  }, [])

  let getUsername = async () => {
    const username = await axios.get('api/user')
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
