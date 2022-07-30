//React, React Router, React Hooks
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

//Pages
import {Menu} from '../../MainPage/Menu/Menu';
import {Lang} from '../../MainPage/Lang/Lang';
import {UserId} from '../../UserId/UserId';
import {t} from "ttag";
import axios from "axios";

const Referals = () => {
    const [openDropDown, setOpenDropDown] = useState(true);
    const [openUserInfo, setOpenUserInfo] = useState(false);
    const [onActive, setActive] = useState(false);

    const navigate = useNavigate();

    //Logout
    const handleLogout = () => {
        axios.get('/api/logout');
        localStorage.removeItem("token");
        navigate("/login");
    };

    //Show Menu
    const backHome = () => {
        navigate("/home");
    };

    //Show information of user
    const showUserInfo = () => {
        setOpenUserInfo(!openUserInfo);
        setOpenDropDown(!openDropDown);
    };


    useEffect(() => {
        fetchPosts();
        getLines();
    }, [])

    const [lines, setLines] = useState({
        first: {
            total: 0,
            profit: 0,
            lost: 0
        },
        second: {
            total: 0,
            profit: 0,
            lost: 0
        },
        third: {
            total: 0,
            profit: 0,
            lost: 0
        }
    })
    const [posts, setPosts] = useState({
        total_line: 0,
        profit: 0,
        lost: 0,
        link: ""
    })
    const getLines = async () => {
        await axios.get('/api/get_lines')
            .then((data) => {
                const result = {
                    first: data.data.first,
                    second: data.data.second,
                    third: data.data.third,
                }

                console.log('resulet')
                console.log(result)
                console.log('data')
                console.log(data.data)
                setLines(result);

            })
    }
    const getFirst = async () => {
        setPosts({
            total_line: lines.first.total,
            profit: lines.first.profit,
            lost: lines.first.lost,
            link: posts.link
        })
        console.log(posts)
    }
    const get_second = async () => {
        setPosts({
            total_line: lines.second.total,
            profit: lines.second.profit,
            lost: lines.second.lost,
            link: posts.link
        })
        console.log(posts)
    }
    const get_third = async () => {
        setPosts({
            total_line: lines.third.total,
            profit: lines.third.profit,
            lost: lines.third.lost,
            link: posts.link
        })
        console.log(posts)
    }

    async function fetchPosts() {
        try {
            const response = await axios.get('/api/referral')
            setPosts(response.data)
        } catch (e) {
        }
    }

    return (
        <div className="homepage">
            <div className="main_container">
                <nav className={onActive ? "navbar" : "navbar_active"}>
                    <Menu isActive={onActive} showMenu={backHome} showUserInfo={showUserInfo}
                          handleLogout={handleLogout}/>

                    {openDropDown ? (
                        <div className="container">
                            <div className="title-referal">{t`Referral link`}</div>
                            <div className="link-invitation">{posts.link}</div>

                            <div className="row" id="info-3-col">
                                <div className="col-sm">
                                    <button onClick={getFirst} className="row">{t`1 line`}</button>
                                    <span>{t`Total person`}:</span>
                                    <ul className="row">
                                        <li>{posts.total_line}</li>
                                    </ul>
                                </div>
                                <div className="col-sm">
                                    <button onClick={get_second} className="row">{t`2 line`}</button>
                                    <span>{t`Profit received`}:</span>
                                    <ul className="row">
                                        <li>{posts.profit}</li>
                                    </ul>
                                </div>
                                <div className="col-sm">
                                    <button onClick={get_third} className="row">{t`3 line`}</button>
                                    <span>{t`Lost profits`}:</span>
                                    <ul className="row">
                                        <li>{posts.lost}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {openUserInfo ? <UserId/> : null}
                </nav>
            </div>
            {/* <img  src={pokeball} alt="" className="pokeball"/> */}
            <Lang isActive={onActive}/>
        </div>
    );
};

export default Referals;
