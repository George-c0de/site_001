import {Route, Routes} from 'react-router-dom';
import MainPage from './components/MainPage/mainpage';
import Signup from './components/Signup/signup';
import Login from './components/Login/login';
import UpdateUser from './components/UpdateUser/updateuser';
import StartGame from './components/StartGame/startgame';
import Statistics from './components/Submenu/Statistics/statistics.jsx';
import Referals from './components/Submenu/Referals/referals';
import Game from './components/Submenu/Game/game';
import Pay from './components/Pay/Pay';
import Deposit from './components/Deposit/Deposit';
import Rules from "./pages/Rules.js"
import Signup2 from './components/Signup2/signup';

function App() {
    //const user=localStorage.getItem("token");
    return (
        <Routes>
            <Route path="/home" exact element={<MainPage/>}/>
            <Route path="/home/game" exact element={<Game/>}/>
            <Route path="/home/statistics" exact element={<Statistics/>}/>
            <Route path="/home/referals" exact element={<Referals/>}/>
            <Route path="/home/pay" exact element={<Pay/>}/>
            <Route path="/home/deposit" exact element={<Deposit/>}/>
            <Route path="/signup" exact element={<Signup/>}/>
            <Route path="/signup/:id" exact element={<Signup2/>}/>
            <Route path="/login" exact element={<Login/>}/>
            <Route path="/update/:id" exact element={<UpdateUser/>}/>
            <Route path="/" exact element={<StartGame/>}/>

            <Route path="/rules" element={<Rules/>}/>

        </Routes>
    );
}

export default App;
