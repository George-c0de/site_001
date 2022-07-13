//React, React Router, React Hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Pages
import { Menu } from '../../MainPage/Menu/Menu';
import { UserId } from '../../UserId/UserId';
import { Lang } from '../../MainPage/Lang/Lang';

const Statistics = () => {
  const [openDropDown, setOpenDropDown] = useState(true);
  const [openNewDropDown, setNewOpenDropDown] = useState(false);
  const [count, setCount] = useState(1);

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
  const showNewMenu = () => {
    setNewOpenDropDown(true);
    setOpenDropDown(false);
  };

  return (
    <div className="homepage">
      <div className="main_container">
        <nav className={ onActive ? "navbar" : "navbar_active" }>
          <Menu isActive={ onActive } showMenu={ backHome } showNewMenu={ showNewMenu } handleLogout={ handleLogout }/>

          { openDropDown ? (
            <ul className="statistic-info">
              <li>Количество участников: <span>1356614</span></li>
              <li>Количество транзакций: <span>1356614</span></li>
              <li>Сумма выплат: <span>1356614</span></li>
            </ul>
          ) : null }

          { openNewDropDown ? <UserId/> : null }
        </nav>
      </div>
      {/* <img  src={pokeball} alt="" className="pokeball"/> */ }
      <Lang isActive={ onActive }/>
    </div>
  );
};

export default Statistics;
