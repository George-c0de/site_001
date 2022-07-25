import React from 'react';
import {useNavigate} from 'react-router-dom';
import {t} from 'ttag';
// Images
import Logo from '../../Ảnh Pokemon Dự Trù/логотип.svg';
import Background from '../../assets/Bg-ball.svg';
import MainBackground from '../../Ảnh Pokemon Dự Trù/фон общий-min.svg';
import axios from "axios";

let data2;
try {
    axios.get('https://8b99-176-193-182-242.eu.ngrok.io/api/login')
        .catch(function (error) {
                if (error.response) {
                    data2 = error.response.status;
                }
            }
        );
} catch (error) {

}
const Startgame = () => {

    const navigate = useNavigate();
    const startGame = () => {

        if (data2 === 501) {
            navigate("/home");
        } else {
            navigate("/login");
        }


    }

    return (
        <div className="background-start">
            {/*Put Image Background Here*/}
            <img src={Logo} className="logo-tokemon" alt=""/>

            <div className='backgrounds'>
                <img src={MainBackground} className="main-background" alt=""/>
                <img src={Background} className="background-blue" alt=""/>
            </div>


            <div className='start-button-container'>
                <span className="start-game" onClick={startGame}>{t`start`}</span>
            </div>
        </div>
    )
}

export default Startgame;