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
    const [data, setData] = useState({
        wallet: "",
        col: 1,
    });
    const [maxi, setMax] = useState(1)
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
    useEffect(() => {
        getTran();
    }, [])
    const getTran = async () => {
        try {
            let response = await axios.get('http://127.0.0.1:8000/api/trans_get_input')

            SetTran(response.data);

            // let a =
            //     [{
            //         'quantity': '10.00',
            //         'data': '2022, 7, 18',
            //         'time': '13:58:12',
            //         'txid': 'sfsfgsfjshkfjs'
            //     }, {'quantity': '465.00', 'data': '2022, 7, 18', 'time': '13:58:12', 'txid': 'asf4gsgs'}]

            //let data = await response.data

            //SetTran(a)
            //console.log(a)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        const getPosts = async () => {
            try {
                await axios.get('http://127.0.0.1:8000/api/user').then((data) => {
                    const result = {
                        id: data.data.id,
                        money: data.data.money,
                        referral_link: data.data.referral_link,
                        referral_amount: data.data.referral_amount,
                        missed_amount: data.data.missed_amount,
                        wallet: data.data.wallet,
                        line_1: data.data.line_1,
                        line_2: data.data.line_2,
                        line_3: data.data.line_3,
                        max_card: data.data.max_card,
                        admin_or: data.data.admin_or,
                        user: data.data.user,
                    }
                    setUser(result);
                    setMax(result.money)
                })

                if (user.wallet !== null) {
                    setData({
                        wallet: user.wallet,
                        col: 1,
                    })
                    console.log(data.wallet)
                    SetState(true);
                } else {
                    setData({
                        wallet: '',
                        col: 1,
                    })
                    console.log('yes')
                    SetState(false);
                }
            } catch (e) {


            }
            console.log(user)
        }
        getPosts();
    }, [user.id]);

    const handleSum = (e) => {
        setData({
            wallet: data.wallet,
            col: e.target.value
        })
        if (Number(data.col) > Number(user.money)) {
            e.target.value = Number(user.money);
            setData({
                wallet: data.wallet,
                col: Number(user.money)
            })
        } else if (Number(data.col) < 1) {
            e.target.value = 1
            setData({
                wallet: data.wallet,
                col: 1
            })
        } else {
            setData({
                wallet: data.wallet,
                col: e.target.value
            })
        }
    }
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.col < 1 || data.col > user.money) {
            alert('Error')
        } else if (data.wallet === '') {
            alert('Error')
        } else {
            try {
                console.log(data)
                axios.post('http://127.0.0.1:8000/api/dis', {
                    wallet: data.wallet,
                    col: data.col
                }, {
        headers: { "Content-Type": "application/json" }
      }).then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
            } catch (e) {
                if (e.response.status === 200) {
                    data.col = 1

                    alert('Ok')
                } else {
                    alert('Error')
                }
            }
        }
    }
    const hundSum = (e) => {
        setData({
            wallet: e.target.value,
            col: data.col
        })
    }
    return (
        <div className="homepage">
            <div className="main_container">
                <nav className={onActive ? "navbar" : "navbar_active"}>
                    <Menu isActive={onActive} showMenu={backHome} showUserInfo={showUserInfo}
                          handleLogout={handleLogout}/>
                    {openUserInfo ? <UserId/> : null}
                </nav>
            </div>
            <form onSubmit={handleSubmit}>
            <div className='pay-container'>
                <div className='pay-title-wrapper'>
                    <h1 className='pay-title'>ВЫВОД СРЕДСТВ</h1>
                    <span className='pay-subtitle'>Доступно к выводу:</span>
                    <span className='pay-money'>{user.money}$</span>
                </div>
                <div className='pay-inputs-wrapper'>
                    <div className='pay-input'>
                        <label htmlFor='sum-input'>Сумма вывода:</label>
                        <input onChange={e => handleSum(e)} value={data.col} required type='number'
                               className='pay-sum-input'
                               name='sum-input'
                        />
                        <span className='pay-input-info'>Комиссия за вывод 1%, min 1 USD</span>
                    </div>
                    <div className='pay-input'>
                        <label htmlFor='address-input'>Адрес вывода:</label>
                        <input readOnly={state_input} onChange={e => hundSum(e)} required type='text'
                               className='pay-address-input' name='address-input' value={data.wallet}/>
                        <span className='pay-input-info'>Кошелек для вывода изменить будет нельзя</span>
                    </div>
                </div>
                <button type={"submit"} className='pay-button'>ВЫВЕСТИ</button>

                <div className='pay-history-wrapper'>
                    <span className='pay-history-title'>ИСТОРИЯ ТРАНЗАКЦИЙ</span>
                    <div className="pay-history-table">
                    <div className="history-table-column">
                      <span className="history-table-title">Время</span>
                      {tran.map((trans)=>{
                        return (<h3>{trans.time}</h3>)
                      })}
                    </div>
                    <div className="history-table-column">
                      <span className="history-table-title">Дата</span>
                      {tran.map((trans)=>{
                        return (<h3>{trans.data}</h3>)
                      })}
                    </div>
                    <div className="history-table-column">
                      <span className="history-table-title">Txid транзакции</span>
                      {tran.map((trans)=>{
                        return (<h3>{trans.txid}</h3>)
                      })}
                    </div>
                    <div className="history-table-column">
                      <span className="history-table-title">Сумма</span>
                      {tran.map((trans)=>{
                        return (<h3>{trans.quantity}</h3>)
                      })}
                    </div>
                    </div>
                </div>

            </div>
            </form>
            <Lang isActive={onActive}/>
        </div>
    )
}

export default Pay;
