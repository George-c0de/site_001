//React, React Router, React Hooks
import React from 'react';
import { useLocation,useNavigate} from 'react-router-dom';

const Mainpage = () => {

    //const [user, setUser] = useState([]);
    const navigate=useNavigate();
    let location = useLocation();
    //const { id } = useParams();

    const handleLogout=()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }

    return(
        <>
            <div className="main_container">
            <nav className="navbar">
                <h1>HomePage</h1>

                <h2>Welcome {location.state}</h2>
                <button className="white_btn_in" onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            </div>

            <div className="site-main">
                <h1>RULES</h1>
            </div>        
        </>
    )
}

export default Mainpage;