//React, React Router, React Hooks
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// Pages
import { Lang } from '../../MainPage/Lang/Lang';
import { Menu } from '../../MainPage/Menu/Menu';
import { UserId } from '../../UserId/UserId';

//Images
import pokeball from "../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg";
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
            <div className="text-game">{t`УЧАСТВУЙ В БИТВАХ И ПОЛУЧАЙ ПРИЗЫ`}</div>

            <div className="container-pack-pokeballs">
              <div className="col-sm" id="title-pack-pokeballs">
                <span>{t`Cards`}</span>
                <div className="pokeballs-container">
                  <div id="pokeballs-detail">
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                  </div>
                  <div className="text-pokeball-1">{t`BRONZE`}</div>
                  <FontAwesomeIcon
                    icon={ faChevronDown }
                    className="icon-showdown"
                  />
                </div>
              </div>
              <div className="col-sm" id="title-pack-pokeballs">
                <span>Cards</span>
                <div className="pokeballs-container">
                  <div id="pokeballs-detail">
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                  </div>
                  <div className="text-pokeball-2">{t`SILVER`}</div>
                  <FontAwesomeIcon
                    icon={ faChevronDown }
                    className="icon-showdown"
                  />
                </div>
              </div>
              <div className="col-sm" id="title-pack-pokeballs">
                <span>Cards</span>
                <div className="pokeballs-container">
                  <div id="pokeballs-detail">
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                  </div>
                  <div className="text-pokeball-3">{t`GOLD`}</div>
                  <FontAwesomeIcon
                    icon={ faChevronDown }
                    className="icon-showdown"
                  />
                </div>
              </div>
              <div className="col-sm" id="title-pack-pokeballs">
                <span>Cards</span>
                <div className="pokeballs-container">
                  <div id="pokeballs-detail">
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                    <img src={ pokeball } className="small-pokeball" alt=""/>
                  </div>
                  <div className="text-pokeball-4">{t`EMERALD`}</div>
                  <FontAwesomeIcon
                    icon={ faChevronDown }
                    className="icon-showdown"
                  />
                </div>
              </div>
            </div>

            <div className="game-history">
              <span>{t`GAME HISTORY`}</span>
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
              <span className='game-history-more'>{t`SHOW MORE`}</span>
            </div>
          </div>

          <Lang isActive={ onActive }/>
        </div>
      </div>
    </>
  );
};

export default Game;
