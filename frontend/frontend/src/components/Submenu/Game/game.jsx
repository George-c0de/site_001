//React, React Router, React Hooks
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

// Pages
import {Lang} from '../../MainPage/Lang/Lang';
import {Menu} from '../../MainPage/Menu/Menu';
import {UserId} from '../../UserId/UserId';
import {PokeballsPack} from './PokeballsPack/PokeballsPack';
import {GameHistory} from './GameHistory/GameHistory';
//Images
import {IMAGES} from './PokeballsModal/PokeballsImages';
import bronze from '../../../assets/backgrounds/бронза фон.svg';
import silver from '../../../assets/backgrounds/серебро-min.svg';
import gold from '../../../assets/backgrounds/золото-min.svg';
import emerald from '../../../assets/backgrounds/изумруд-min.svg';

import {t} from "ttag";
import axios from "axios";

const initialCardsAmount = {
    bronze: [0],
    silver: [0],
    gold: [0],
    emerald: [0]
}

const Game = () => {
        const [openDropDown, setOpenDropDown] = useState(false);
        const [openUserInfo, setOpenUserInfo] = useState(false);
        const [onActive, setActive] = useState(true);
        const [cardsAmount, setCardsAmount] = useState(initialCardsAmount);
        const navigate = useNavigate();
        const [username, setUsername] = useState("");
        const [price,setPrice] = useState({
            bronze: [10,15,25,40,50,77],
            silver: [100,150,250,400,500,666],
            gold: [750,1000,1250,1500,2000,2222],
            emerald: [2500,5000,7500,10000,15000,22222]
        });
        const [history,setHistory] = useState({
            oneq :  [0,0,0],
            two: [0,0,0],
            the: [0,0,0]
        })
        const [card_data, setCard_data] = useState({
            bronze : [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
            silver : [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
            gold : [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
            emerald : [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]]})
//Logout
        const handleLogout = () => {
            localStorage.removeItem("token");
            navigate("/login");
        };

        const getCard = async () => {
            await axios.get('http://127.0.0.1:8000/api/get_user_in_matrix')
                .then((data) => {
                    const result = {
                        bronze: data.data.bronze,
                        silver: data.data.silver,
                        gold: data.data.gold,
                        emerald: data.data.emerald
                    }

                    setCardsAmount(result);
                })

        }

        useEffect(() => {
            getCard();
            getUsername();
            getCard_data();
            getHist();
        }, [])

        let getUsername = async () => {
            const username = await axios.get('http://127.0.0.1:8000/api/user')
            setUsername(username.data.username);
        }
        let getHist = async () => {
            // const username = await axios.get('http://127.0.0.1:8000/api/get_user_in_card')
            // setCard_data(username.data);
            await axios.get('http://127.0.0.1:8000/api/get_hist_card')
                .then((data) => {
                    const result = {
                        oneq: data.data.oneq,
                        two: data.data.two,
                        the: data.data.the,
                    }
                    console.log(result)
                    console.log(history)
                    setHistory(result);
                })
        }
        let getCard_data = async () => {
            // const username = await axios.get('http://127.0.0.1:8000/api/get_user_in_card')
            // setCard_data(username.data);
            await axios.get('http://127.0.0.1:8000/api/get_user_in_card')
                .then((data) => {
                    const result = {
                        bronze: data.data.bronze,
                        silver: data.data.silver,
                        gold: data.data.gold,
                        emerald: data.data.emerald
                    }

                    setCard_data(result);
                })
            // setCard_data({
            //     bronze: [[78, 300, 400], [2, 6300, 400], [3, 700, 900], [1, 800, 900], [], [],],
            //     silver: [[77, 300, 400], [2, 6300, 400], [3, 700, 900], [1, 800, 900], [], [],],
            //     gold: [[80, 300, 400], [2, 6300, 400], [3, 700, 900], [1, 800, 900], [], [],],
            //     emerald: [[1, 300, 400], [2, 6300, 400], [3, 700, 900], [1, 800, 900], [], [],]
            // })
        }
//Show Menu
        const backHome = () => {
            navigate("/home");
        };

//Show informations of user
        const showUserInfo = () => {
            if (!openDropDown) {
                setOpenUserInfo(!openUserInfo);
                setActive(!onActive);
            } else {
                setOpenUserInfo(!openUserInfo);
                setOpenDropDown(!openDropDown);
            }
        };

        return (
            <>
                {/*<h1>{ username }</h1>*/}
                <div className="homepage">
                    <div className="main_container">
                        <nav className={onActive ? "navbar" : "navbar_active"}>
                            <Menu isActive={onActive} showMenu={backHome} showUserInfo={showUserInfo}
                                  handleLogout={handleLogout}/>
                            {openUserInfo ? <UserId/> : null}
                        </nav>
                    </div>

                    <div className={onActive ? "site-main-game" : "site-main_active"}>
                        <div className='site-main-game-wrapper'>
                            <div className="text-game">{t`JOIN THE FIGHT AND WIN`}</div>

                            <div className="container-pack-pokeballs">

                                <PokeballsPack title={'BRONZE'}
                                               amount={cardsAmount.bronze}
                                               images={IMAGES.slice(0, 6)}
                                               background={bronze}
                                               card_data={card_data.bronze}
                                               price ={price.bronze}
                                />
                                <PokeballsPack title={'SILVER'}
                                               amount={cardsAmount.silver}
                                               images={IMAGES.slice(6, 12)}
                                               background={silver}
                                               card_data={card_data.silver}
                                               price ={price.silver}
                                />
                                <PokeballsPack title={'GOLD'}
                                               amount={cardsAmount.gold}
                                               images={IMAGES.slice(12, 18)}
                                               background={gold}
                                               card_data={card_data.gold}
                                               price = {price.gold}
                                />
                                <PokeballsPack title={'EMERALD'}
                                               amount={cardsAmount.emerald}
                                               images={IMAGES.slice(18, 24)}
                                               background={emerald}
                                               card_data={card_data.emerald}
                                               price = {price.emerald}
                                />
                            </div>

                            <GameHistory history = {history}/>

                        </div>

                        <Lang isActive={onActive}/>
                    </div>
                </div>
            </>
        );
    }
;

export default Game;