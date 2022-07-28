import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useState} from "react";
import axios from "axios";
import {t} from 'ttag';

//Images
import logo from "../../Ảnh Pokemon Dự Trù/логотип.svg";
import pikachu_pokeball from "../../Ảnh Pokemon Dự Trù/пикачу в пакеболе-min.svg";

//Captcha
import Captcha from "./captcha";

// Pages
import {Lang} from '../MainPage/Lang/Lang';

const Signup = () => {
    const [data, setData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    });

    const params = useParams();
    const navigate = useNavigate();

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //const url = "http://localhost:8080/api/users";
            //const {data: res} = await axios.post("http://127.0.0.1:8000/api/register", data);
            const {data: res} = await axios.post("http://127.0.0.1:8000/api/register", data, {
                headers: {"Content-Type": "application/json"}
            });
            console.log(res.data);
            navigate("/login"); //after registering navigate to login page
            console.log(res.message);
        } catch (error) {
            alert(error.response.data.msg);
        }
    };

    return (
        <div className="signup_container">
            <div className='navbar-container'>
                <nav className="navbar">
                    <img src={logo} className="logo-tokemon" alt=""/>
                </nav>
            </div>

            <img src={pikachu_pokeball} className="pikachu-pokeball" alt=""/>

            <div className="signup_form_container bubble-speech">
                {/*Left side: Sign in*/}
                <div className="left">
                    <div>Already had account?</div>
                    <Link to="/login" className="signup-link">
                        <button type="button" className="green_btn">
                            {t`Sign Up`}
                        </button>
                    </Link>

                </div>

                {/*Right side: Sign up*/}
                <div className="right">
                    <form className="form_container" onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder={t`Username`}
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            required
                            className="input"
                        />
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
                            name="password1"
                            onChange={handleChange}
                            value={data.password1}
                            required
                            className="input"
                        />

                        <input
                            type="password"
                            placeholder={t`Confirm Password`}
                            name="password2"
                            onChange={handleChange}
                            value={data.password2}
                            required
                            className="input"
                        />

                        <div className="captcha"></div>

                        <div className="captcha-wrapper">
                            <Captcha/>
                        </div>

                        <button type="submit" className="yellow_btn">
                            {t`Sign Up`}
                        </button>
                    </form>
                </div>
            </div>

            <Lang/>
        </div>
    );
};

export default Signup;
