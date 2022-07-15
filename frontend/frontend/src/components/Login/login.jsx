import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

import { saveLocale } from '../../i18nInit';
//Images
import logo from "../../Ảnh Pokemon Dự Trù/логотип.svg";
import pikachu_pokeball from "../../Ảnh Pokemon Dự Trù/пикачу в пакеболе-min.svg";


// Pages
import { Lang } from '../MainPage/Lang/Lang';

import { t } from "ttag";

const Signup = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data2 = await axios.post('http://127.0.0.1:8000/api/login', data)
                .catch(function (error) {
                    if (error.response) {
                        data2 = error.response.status;
                    }
                });
            console.log("data2")
            console.log(data2.data)
            if (data2.data === 200) {
                navigate("/home"); //after registering navigate to login page
            }

        } catch (error) {
            //console.log(error.response.data.msg);
            alert("Wrong email or password!");
        }
    };
    return (
        <div className="login_container">
            <div className='navbar-container'>
                <nav className="navbar">
                    <img src={logo} className="logo-tokemon" alt=""/>
                </nav>
            </div>

            <img src={pikachu_pokeball} className="pikachu-pokeball" alt=""/>

            <div className="login_form_container bubble-speech">
                <div className="left">
                    <form className="form_container" onSubmit={handleSubmit}>
                        <div>{t`Log In`}</div>
                        <input
                            type="email"
                            placeholder={t`Email`}
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder={t`Password`}
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className="input"
                        />
                        <button type="submit" className="green_btn">
                            {t`Sign Up`}
                        </button>
                    </form>
                </div>
                <div className="right">
                    <h1>{t`New Here`}?</h1>
                    <Link to="/signup">
                        <button type="button" className="yellow_btn">
                            {t`Зарегистрироваться`}
                        </button>
                    </Link>
                </div>
            </div>

            <Lang/>
        </div>
    );
};

export default Signup;
