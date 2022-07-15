//React, React Router, React Hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//Pages
import { Menu } from '../../MainPage/Menu/Menu';
import { Lang } from '../../MainPage/Lang/Lang';
import { UserId } from '../../UserId/UserId';
import {t} from "ttag";

const Referals = () => {
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
            <div className="container">
              <div className="title-referal">{t`Referral link`}</div>
              <div className="link-invitation"></div>

              <div className="row" id="info-3-col">
                <div className="col-sm">
                  <button className="row">{t`1 line`}</button>
                  <span>{t`Total person`}:</span>
                  <ul className="row">
                    <li>140</li>
                    <li>140</li>
                    <li>140</li>
                  </ul>
                </div>
                <div className="col-sm">
                  <button className="row">{t`2 line`}</button>
                  <span>{t`Profit received`}:</span>
                  <ul className="row">
                    <li>240$</li>
                    <li>240$</li>
                    <li>240$</li>
                  </ul>
                </div>
                <div className="col-sm">
                  <button className="row">{t`3 line`}</button>
                  <span>{t`Lost profits`}:</span>
                  <ul className="row">
                    <li>246$</li>
                    <li>246$</li>
                    <li>246$</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null }

          { openUserInfo ? <UserId /> : null }
        </nav>
      </div>
      {/* <img  src={pokeball} alt="" className="pokeball"/> */ }
      <Lang isActive={onActive}/>
    </div>
  );
};

export default Referals;
