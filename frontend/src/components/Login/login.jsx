import { Link,useNavigate } from 'react-router-dom';
import React,{useState} from 'react';


const Signup=()=>{
    const [data,setData]=useState({
        email:"",
        password:""
    });

    const navigate=useNavigate();

    const handleChange=({currentTarget:input})=>{
        setData({...data,[input.name]:input.value});
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();

        navigate("/home");

    }
    return(
        <div className="login_container">
            <div className="login_form_container">
                <div className="left">
                    <form className="form_container" onSubmit={handleSubmit}>
                            <h1>Login to your Account</h1>
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
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                required
                                className="input"
                            />

                            <button type="submit" className="green_btn">
                                Sign In
                            </button>
                    </form>
                </div>

                <div className="right">
                    <h1>New Here?</h1>
                    <Link to="/signup">
                        <button type="button" className="white_btn">
                            Sign up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup;