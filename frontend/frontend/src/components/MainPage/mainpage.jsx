//React, React Router, React Hooks
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
//import axios from 'axios';

//Font Awesome
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faPaperPlane} from "@fortawesome/free-solid-svg-icons";

//Images
import logo from "../../Ảnh Pokemon Dự Trù/логотип.svg";
import human from "../../Ảnh Pokemon Dự Trù/Чел.svg";
import satoshi from "../../Ảnh Pokemon Dự Trù/123133.svg";
import britain from "../../Ảnh Pokemon Dự Trù/gb-1.svg";
import support from "../../Ảnh Pokemon Dự Trù/супорт.svg";
import axios from "axios";
//import pokeball from '../../Ảnh Pokemon Dự Trù/poke-ball.png';

const Mainpage = () => {
        const [openDropDown, setOpenDropDown] = useState(false);
        const [openNewDropDown, setNewOpenDropDown] = useState(false);

        const [isActive, setActive] = useState("false");
        const navigate = useNavigate();
        const [note, setNote] = useState(null)

        //let note = notes.find(note => note.id == noteId)

        useEffect(() => {

            getNote()
        },[])

        const getNote = async () => {
            const response = await fetch(`http://localhost:8000/api/user`)
            const data = await response.json()
            setNote(data)
        }
        //const { id } = useParams();

        //Logout
        const handleLogout = () => {
            localStorage.removeItem("token");
            navigate("/login");
        };

        //Show Menu
        const showMenu = () => {
            setOpenDropDown(!openDropDown);
            setNewOpenDropDown(false);
            setActive(!isActive);
        };

        //Show informations of user
        const showNewMenu = () => {
            setNewOpenDropDown(!openNewDropDown);
            setOpenDropDown(false);
            setActive(!isActive);
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


//   useEffect(async() => {
//   const res= await axios.get('http://localhost:8000/api/user');
//   console.log(res)
// },[]);
        return (
            <div className="homepage">
                <div className="main_container">
                    <nav className={isActive ? "navbar" : "navbar_active"}>
                        <FontAwesomeIcon
                            icon={faBars}
                            className={isActive ? "icon-menu" : "icon_menu_active"}
                            onClick={showMenu}
                        />
                        {openDropDown ? (
                            <ul className="menu-info">
                                <li onClick={showGame}>MAIN</li>
                                <li onClick={showReferals}>REFFERALS</li>
                                <li onClick={showStatistics}>STATISTICS</li>
                                <li>RULES</li>
                                <FontAwesomeIcon icon={faPaperPlane} className="paper-plane"/>
                                <span className="telegram-user">USE TELEGRAM BOT</span>
                            </ul>
                        ) : null}

                        <img
                            className={isActive ? "pokemon-banner" : "pokemon-banner_active"}
                            src={logo}
                            alt=""
                        />

                        <img
                            src={human}
                            className={isActive ? "icon-user" : "icon-user_active"}
                            onClick={showNewMenu}
                            alt=""
                        />
                        {openNewDropDown ? (
                            <ul className="user-info">
                                <span className="user-id">User Id-{note?.id}</span>

                                <li>Balance:{note?.money}</li>
                                <li>Cards profit:{note?.money}</li>

                                <li>Referal profit:{note?.line_1 + note?.line_2 +note?.line_3}</li>
                                <li>Link for invitation {note?.referral_link}</li>
                                <div className="link-invitation"></div>

                                <button className="yellow-btn">Deposit</button>
                                <button className="yellow-btn">Withdraw</button>

                                <img className="satoshi" src={satoshi} alt=""/>
                            </ul>
                        ) : null}

                        <button
                            className={isActive ? "white_btn_in" : "white_btn_in_active"}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </nav>
                </div>
                {/* <img  src={pokeball} alt="" className="pokeball"/> */}
                <div className={isActive ? "site-main" : "site-main_active"}>
                    <img
                        src={britain}
                        className={
                            isActive ? "english-icon-mainpage" : "english-icon-mainpage_active"
                        }
                        alt=""
                    />

                    <img
                        src={support}
                        className={
                            isActive ? "support-icon-mainpage" : "support-icon-mainpage_active"
                        }
                        alt=""
                    />
                </div>
            </div>
        );
    }
;

export default Mainpage;
