import React, {useEffect, useRef, useState} from 'react';
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
    const [data, setData] = useState({
        wallet: "",
        col: 0,
    });
    let [tran, SetTran] = useState([])
    let [user, setUser] = useState({
        id: 0,
        money: 0,
        referral_link: "",
        referral_amount: "",
        missed_amount: "",
        wallet: null,
        line_1: null,
        line_2: null,
        line_3: null,
        max_card: 0,
        admin_or: false,
        user: 0
    })
    const getTran = async () => {
        try {
            let response = await axios.get('http://127.0.0.1:8000/api/trans_get_input');
            let data = await response.data
            SetTran(data)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        const getPosts = async () => {
            try {
                let response = await axios.get('http://127.0.0.1:8000/api/user');
                let data = await response.data
                setUser(data);
                if (user.wallet !== null) {
                    SetWallet(user.wallet);
                    setData({
                        wallet: wallet,
                        col: 1,
                    })
                } else {
                    SetState(false);
                }
            } catch (e) {
                SetState(false);

            }
        }
        getPosts();
    }, [user.id]);

    //Send transaction
    const sumInput = useRef(null)
    const walletInput = useRef(null)

    const handleSumInput = () => {
        if (sumInput.current.value <= user.money) {
            setData(Object.assign(data, {
                col: sumInput.current.value
            }))
        }
    }

    const handleWalletInput = () => {
        setData(Object.assign(data, {
            wallet: walletInput.current.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.col > user.money) {
            alert("Not enough money to make transaction")
        }

        try {
            let data2 = await axios.post('http://127.0.0.1:8000/api/dis', data)
            console.log(data2);

        } catch (error) {
            //console.log(error.response.data.msg);
            alert("Transaction error, please try again");
        }
    };
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
                        <input value={data.col} required type='number' className='pay-sum-input' name='sum-input'
                               min='1'
                               onInput={() => handleSumInput()}
                        />
                        <span className='pay-input-info'>Комиссия за вывод 1%, min 1 USD</span>
                    </div>
                    <div className='pay-input'>
                        <label htmlFor='address-input'>Адрес вывода:</label>
                        {wallet &&
                            <div className='pay-address-input' name='address-input'>{wallet}</div>
                            ||
                            <input type='text' className='pay-address-input' name='address-input'
                                   onInput={() => handleWalletInput()} ref={walletInput}/>}
                        <span className='pay-input-info'>Кошелек для вывода изменить будет нельзя</span>
                    </div>
                </div>
                <button className='pay-button' onClick={() => handleSubmit()}>ВЫВЕСТИ</button>
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
                    {tran.map((trans, i) => {
                        return (
                            <div className="pay-history-row" key={i}>
                                <div className="history-table-column">{trans.time}</div>
                                <div className="history-table-column">{trans.data}</div>
                                <div className="history-table-column">{trans.txid}</div>
                                <div className="history-table-column">{trans.quantity}</div>
                            </div>
                        )
                    })}
                </div>

            </div>
            <Lang isActive={onActive}/>
        </div>
    )
}

export default Pay;
