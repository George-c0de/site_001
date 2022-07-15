import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'ttag';

// Pages
import { Menu } from '../MainPage/Menu/Menu';
import { UserId } from '../UserId/UserId';
import { Lang } from '../MainPage/Lang/Lang';

const Pay = () => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [onActive, setActive] = useState(true);

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
    setActive(!onActive);
  };

  return (
    <div className="homepage">
      <div className="main_container">
        <nav className={ onActive ? "navbar" : "navbar_active" }>
          <Menu isActive={ onActive } showMenu={ backHome } showUserInfo={ showUserInfo } handleLogout={ handleLogout }/>
          { openUserInfo ? <UserId /> : null }
        </nav>
      </div>

      <Lang isActive={onActive}/>
    </div>
  )
}

export default Pay;
