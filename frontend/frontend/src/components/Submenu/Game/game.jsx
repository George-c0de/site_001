//React, React Router, React Hooks
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Pages
import { Lang } from '../../MainPage/Lang/Lang';
import { Menu } from '../../MainPage/Menu/Menu';
import { UserId } from '../../UserId/UserId';
import { PokeballsPack } from './PokeballsPack/PokeballsPack';
import { GameHistory } from './GameHistory/GameHistory';

//Images
import axios from "axios";
import {t} from "ttag";

const Game = () => {
  const [openNewDropDown, setNewOpenDropDown] = useState(false);
  const [onActive, setActive] = useState("false");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
  const showNewMenu = () => {
    setNewOpenDropDown(!openNewDropDown);
    setActive(!onActive);
  };

  return (
    <>
      {/*<h1>{ username }</h1>*/ }
      <div className="homepage">
        <div className="main_container">
          <nav className={ onActive ? "navbar" : "navbar_active" }>
            <Menu isActive={ onActive } showMenu={ backHome } showNewMenu={ showNewMenu }
                  handleLogout={ handleLogout }/>
            { openNewDropDown ? <UserId/> : null }
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
