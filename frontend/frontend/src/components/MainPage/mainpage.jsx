//React, React Router, React Hooks
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

// Pages
import {Menu} from './Menu/Menu';
import {Lang} from './Lang/Lang';
import {UserId} from '../UserId/UserId';

import {t} from 'ttag';
//Font Awesome
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import  q from "../../Ảnh Pokemon Dự Trù/значок выйти-min.svg";
import tele from"../../Ảnh Pokemon Dự Trù/telegram-min.svg";
//import {set} from '../../cookie';

const Mainpage = () => {
        const [openDropDown, setOpenDropDown] = useState(true);
        const [openUserInfo, setOpenUserInfo] = useState(false);
        const [isActive, setActive] = useState(false);

        const navigate = useNavigate();
        useEffect(() => {
            fetchPosts()
        }, [])
        const [posts, setPosts] = useState({
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

        async function fetchPosts() {
            try {
                const response = await axios.get('/api/user')
                setPosts(response.data)
            } catch (e) {
            }

        }

        //const { id } = useParams();
        //Logout
        const handleLogout = () => {
            let data2 = axios.get('/api/logout');
            localStorage.removeItem("token");
            navigate("/login");
        };
        useEffect(() => {
            fetchLink()
        }, [])
        const [get_link_tg, setget_link_tg] = useState({
            'link_tg': "https://t.me/Tokemon_game_Bot"
        })

        async function fetchLink() {
            try {
                const response = await axios.get('/api/get_link_tg')
                setget_link_tg(response.data.link_tg)

            } catch (e) {
                if (e.response.status !== 200) {
                    let data_ = "https://t.me/Tokemon_game_Bot"
                    setget_link_tg(data_)
                }
            }
        }

        //Show Menu
        const showMenu = () => {
            if (!isActive) {
                setOpenDropDown(false);
                setOpenUserInfo(false);
                setActive(true);
            } else {
                setOpenDropDown(true);
                setOpenUserInfo(false);
                setActive(false);
            }
        };
        const showMenuHome=()=>{
            if(isActive===false){
                setOpenDropDown(false);
                setOpenUserInfo(false);
                setActive(true);
            }
        };

        //Show informations of user
        const showUserInfo = () => {
            console.log(openDropDown)
            if (!openDropDown) {
                setOpenUserInfo(!openUserInfo);
                setActive(!isActive);
            } else {
                setOpenUserInfo(!openUserInfo);
                setOpenDropDown(!openDropDown);
            }
        };

        //Show Game
        const showGame = () => {
            navigate("/home/game");
        }

        //Show Referals
        const showReferals = () => {
            navigate("/home/referals");
        };

        //Show Statistics
        const showStatistics = () => {
            navigate("/home/statistics");
        };
        const showRules = () => {
            navigate("/rules");
        }
//   useEffect(async() => {
//   const res= await axios.get('/api/user');
//   console.log(res)
// },[]);

        return (
            <div className="homepage" onClick={showMenuHome}>
                <div className="main_container">
                    <nav className={isActive ? "navbar" : "navbar_active"}>
                        <Menu isActive={isActive} showMenu={showMenu} showUserInfo={showUserInfo}
                              handleLogout={handleLogout}/>

                        {openDropDown ? (
                            <>
                                <ul className="menu-info">
                                    <li onClick={showGame}>{t`MAIN`}</li>
                                    <li onClick={showReferals}>{t`REFFERALS`}</li>
                                    <li onClick={showStatistics}>{t`STATISTICS`}</li>
                                    <li onClick={showRules}>{t`RULES`}</li>
                                </ul>
                                <div className="menu-info-icons">
                                    <div className='info-icons-container'>
                                        <img src={tele} className="paper-plane"/>
                                        <a href={get_link_tg} className="telegram-user">{t`USE TELEGRAM BOT`}</a>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {openUserInfo ? <UserId note={posts}/> : null}
                    </nav>
                </div>
                {/* <img  src={pokeball} alt="" className="pokeball"/> */}
                <Lang isActive={isActive}/>
            </div>
        );
    }
;

export default Mainpage;
