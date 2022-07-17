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
import {t} from "ttag";
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

  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  const getCardData = async () => {
    await axios.get('http://localhost:8000/api/get_user_in_matrix')
      .then((data) => {
        const result = {
          bronze: data.bronze,
          silver: data.silver,
          gold: data.gold,
          emerald: data.emerald
        }

        setCardsAmount(result);
      })
  }

  useEffect(() => {
    getUsername()
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
            <div className="text-game">{t`JOIN THE FIGHT AND WIN`}</div>

            <div className="container-pack-pokeballs">

              <PokeballsPack title={ 'BRONZE' }/>
              <PokeballsPack title={ 'SILVER' }/>
              <PokeballsPack title={ 'GOLD' }/>
              <PokeballsPack title={ 'EMERALD' }/>
            </div>

            <GameHistory />

          </div>

          <Lang isActive={ onActive }/>
        </div>
      </div>
    </>
  );
};

export default Game;
