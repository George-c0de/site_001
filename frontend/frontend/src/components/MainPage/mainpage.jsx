//React, React Router, React Hooks
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Pages
import { Menu } from './Menu/Menu';
import { Lang } from './Lang/Lang';
import { UserId } from '../UserId/UserId';

import { t } from 'ttag';
//Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { set } from '../../cookie';

const Mainpage = () => {
    const [openDropDown, setOpenDropDown] = useState(false);
    const [openUserInfo, setOpenUserInfo] = useState(false);
    const [isActive, setActive] = useState(true);

    const navigate = useNavigate();
    const [note, setNote] = useState(null)

    //let note = notes.find(note => note.id == noteId)

    useEffect(() => {
      getNote()
    }, [])

    const getNote = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/user`)
      const data = await response.json()
      setNote(data)
    }
    //const { id } = useParams();

    //Logout
    const handleLogout = () => {
      let data2 = axios.get('http://127.0.0.1:8000/api/logout');
      localStorage.removeItem("token");
      navigate("/login");
    };

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

    //Show informations of user
    const showUserInfo = () => {
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


//   useEffect(async() => {
//   const res= await axios.get('http://localhost:8000/api/user');
//   console.log(res)
// },[]);

    return (
      <div className="homepage">
        <div className="main_container">
          <nav className={ isActive ? "navbar" : "navbar_active" }>
            <Menu isActive={ isActive } showMenu={ showMenu } showUserInfo={ showUserInfo } handleLogout={ handleLogout }/>

            { openDropDown ? (
              <>
                <ul className="menu-info">
                  <li onClick={ showGame }>{ t`MAIN` }</li>
                  <li onClick={ showReferals }>{ t`REFFERALS` }</li>
                  <li onClick={ showStatistics }>{ t`STATISTICS` }</li>
                  <li>{ t`RULES` }</li>
                </ul>
                <div className="menu-info-icons">
                  <div className='info-icons-container'>
                    <FontAwesomeIcon icon={ faPaperPlane } className="paper-plane"/>
                    <span className="telegram-user">{ t`USE TELEGRAM BOT` }</span>
                  </div>
                </div>
              </>
            ) : null }

            { openUserInfo ? <UserId note={ note }/> : null }
          </nav>
        </div>
        {/* <img  src={pokeball} alt="" className="pokeball"/> */ }
        <Lang isActive={ isActive }/>
      </div>
    );
  }
;

export default Mainpage;
