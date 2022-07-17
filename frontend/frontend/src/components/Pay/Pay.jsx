import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
// Pages
import {Menu} from '../MainPage/Menu/Menu';
import {UserId} from '../UserId/UserId';
import {Lang} from '../MainPage/Lang/Lang';

import './Pay.css';
import axios from "axios";

const Pay = () => {
    const [openUserInfo, setOpenUserInfo] = useState(false);
    const [onActive, setActive] = useState(true);
    const navigate = useNavigate();
    const [state_input, SetState] = useState(true);
    const [wallet, SetWallet] = useState("")

  let [user,setUser] = useState({
            "id": 0,
            "money": "0.00",
            "referral_link": "",
            "referral_amount": "",
            "missed_amount": "",
            "wallet": null,
            "line_1": null,
            "line_2": null,
            "line_3": null,
            "max_card": 0,
            "admin_or": false,
            "user": 0
  })
    useEffect(()=>{
            const getPosts = async()=>{
                try {
                let response = await axios.get('http://127.0.0.1:8000/api/user');

                let data = await response.data
                console.log(data)
                setUser(data);
                console.log(user)
                SetState(false);
                if (user.wallet !== null) {
                    SetState(false);
                    SetWallet(user.wallet);
                } else {

                }
            } catch (e) {
            }}
        getPosts();
},[user.id]);
  // async function getPosts() {
  //           try {
  //               let response = await axios.get('http://127.0.0.1:8000/api/user');
  //
  //               let data = await response
  //               console.log(data)
  //
  //               setUser(data);
  //               console.log(user)
  //               SetState(false);
  //               if (user.wallet !== null) {
  //                   SetState(false);
  //                   SetWallet(user.wallet);
  //               } else {
  //
  //               }
  //           } catch (e) {
  //           }
  //
  //       }


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
                <nav className={onActive ? "navbar" : "navbar_active"}>
                    <Menu isActive={onActive} showMenu={backHome} showUserInfo={showUserInfo}
                          handleLogout={handleLogout}/>
                    {openUserInfo ? <UserId/> : null}
                </nav>
            </div>
            <div className='pay-container'>
                <div className='pay-title-wrapper'>
                    <h1 className='pay-title'>ВЫВОД СРЕДСТВ</h1>
                    <span className='pay-subtitle'>Доступно к выводу:</span>
                    <span className='pay-money'>{user.money}$</span>
                </div>
                <div className='pay-inputs-wrapper'>
                    <div className='pay-input'>
                        <label htmlFor='sum-input'>Сумма вывода:</label>
                        <input type='text' className='pay-sum-input' name='sum-input'/>
                        <span className='pay-input-info'>Комиссия за вывод 1%, min 1 USD</span>
                    </div>
                    <div className='pay-input'>
                        <label htmlFor='address-input'>Адрес вывода:</label>
                        <input disabled={state_input} value={wallet} type='text' className='pay-address-input'
                               name='address-input'/>
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
            <Lang isActive={onActive}/>
        </div>
    )
}

export default Pay;
