//React, React Router, React Hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Pages
import { Menu } from '../../MainPage/Menu/Menu';
import { UserId } from '../../UserId/UserId';
import { Lang } from '../../MainPage/Lang/Lang';
import {t} from "ttag";

const Statistics = () => {
  const [openDropDown, setOpenDropDown] = useState(true);
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [onActive, setActive] = useState(false);

  const navigate = useNavigate();

  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //Show Menu
  const backHome = () => {
    navigate("/home");
  };

  //Show informations of user
  const showUserInfo = () => {
    setOpenUserInfo(!openUserInfo);
    setOpenDropDown(!openDropDown);
  };

  return (
    <div className="homepage">
      <div className="main_container">
        <nav className={ onActive ? "navbar" : "navbar_active" }>
          <Menu isActive={ onActive } showMenu={ backHome } showUserInfo={ showUserInfo } handleLogout={ handleLogout }/>

          { openDropDown ? (
            <ul className="statistic-info">
              <li>{t`TOTAL USERS`}: <span>1356614</span></li>
              <li>{t`TOTAL  TRANSACTIONS`}: <span>1356614</span></li>
              <li>{t`TOTAL PAYOUT`}: <span>1356614</span></li>
            </ul>
          ) : null }

          { openUserInfo ? <UserId/> : null }
        </nav>
      </div>
      {/* <img  src={pokeball} alt="" className="pokeball"/> */ }
      <Lang isActive={ onActive }/>
    </div>
  );
};

export default Statistics;
