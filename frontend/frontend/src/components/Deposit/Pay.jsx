import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Pages
import { Menu } from '../MainPage/Menu/Menu';
import { UserId } from '../UserId/UserId';
import { Lang } from '../MainPage/Lang/Lang';

import './Pay.css';

const Pay = () => {
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
          <Menu isActive={ onActive } showMenu={ backHome } showUserInfo={ showUserInfo }
                handleLogout={ handleLogout }/>
          { openUserInfo ? <UserId/> : null }
        </nav>
      </div>
      <div className='pay-container'>
        <div className='pay-title-wrapper'>
          <h1 className='pay-title'>Пополнить:</h1>
        </div>
        <div className='pay-inputs-wrapper'>
          <div className='pay-input'>
            <label htmlFor='sum-input'>Сумма:</label>
            <input type='text' className='pay-sum-input' name='sum-input'/>
            <span className='pay-input-info'>Комиссия за вывод 1%, min 1 USD</span>
          </div>
          <div className='pay-input'>
            <label htmlFor='address-input'>Адрес вывода:</label>
            <input type='text' className='pay-address-input' name='address-input'/>
            <span className='pay-input-info'>Кошелек для вывода изменить будет нельзя</span>
          </div>
        </div>
        <button className='pay-button'>ВЫВЕСТИ</button>
        <div className='pay-history-wrapper'>
          <span className='pay-history-title'>ИСТОРИЯ ТРАНЗАКЦИЙ</span>
          <div className='pay-history-table'>
            <div className='history-table-column'>
              <span className='history-table-title'>Время</span>
            </div>
            <div className='history-table-column'>
              <span className='history-table-title'>Дата</span>
            </div>
            <div className='history-table-column'>
              <span className='history-table-title'>Txid транзакции</span>
            </div>
            <div className='history-table-column'>
              <span className='history-table-title'>Сумма</span>
            </div>
          </div>
        </div>
      </div>
      <Lang isActive={ onActive }/>
    </div>
  )
}

export default Pay;
