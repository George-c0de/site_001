import {Link, useNavigate} from "react-router-dom";
import React, {useState,useCallback} from "react";
import axios from "axios";

//Images
import logo from "../../Ảnh Pokemon Dự Trù/логотип.svg";
import pikachu_pokeball from "../../Ảnh Pokemon Dự Trù/пикачу в пакеболе-min.svg";
import britain from "../../Ảnh Pokemon Dự Trù/gb-1.svg";
import support from "../../Ảnh Pokemon Dự Trù/супорт.svg";

//Captcha
import Captcha from "./captcha";

const Signup = () => {
    const [data, setData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    });
    
    const [isCheck,setIsCheck]=useState(false);

    const navigate = useNavigate();
    
    const handleChangeItem = useCallback((childData) => {
      setIsCheck(childData);
    }, []);

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
         if(isCheck===false){
            alert("Check Captcha please!")
            }
            else{
                try {
                //const url = "http://localhost:8080/api/users";
                //const {data: res} = await axios.post("http://localhost:8000/api/register", data);
                const {data: res} = await axios.post("http://localhost:8080/api/register", data, {
                    headers: {"Content-Type": "application/json"}
                });
                console.log(res.data);
                navigate("/login"); //after registering navigate to login page
                console.log(res.message);
            } catch (error) {
                alert(error.response.data.msg);
            }
        }   
    };

    return (
        <div className="signup_container">
            <nav className="navbar">
                <img src={logo} className="logo-tokemon" alt=""/>
            </nav>

            <img src={pikachu_pokeball} className="pikachu-pokeball" alt=""/>

            <div className="signup_form_container bubble-speech">
                {/*Left side: Sign in*/}
                <div className="left">
                    <div>Already had account?</div>
                    <Link to="/login">
                        <button type="button" className="green_btn">
                            Sign in
                        </button>
                    </Link>
                </div>

                {/*Right side: Sign up*/}
                <div className="right">
                    <form className="form_container" onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            required
                            className="input"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className="input"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            name="password1"
                            onChange={handleChange}
                            value={data.password1}
                            required
                            className="input"
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            onChange={handleChange}
                            value={data.password2}
                            required
                            className="input"
                        />

                        <div className="captcha">Captcha</div>
                        <Captcha parentCallback={handleChangeItem}/>

                        <button type="submit" className="yellow_btn">
                            Further
                        </button>
                    </form>
                </div>

                <img src={britain} className="english-icon-new" alt=""/>

                <img src={support} className="support-icon-new" alt=""/>
            </div>
        </div>
    );
};

export default Signup;
