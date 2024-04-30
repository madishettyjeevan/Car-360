// src/components/Login.js
import React,{useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';

import axios from '../../axios';

import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

const Register = () => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setusername] = useState('');

    const navigate = useNavigate();
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setpopUpText] = useState("");
    // eslint-disable-next-line
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const blurredBackgroundStyles = isBackgroundBlurred
        ? {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            backdropFilter: "blur(1.8px)",
            zIndex: 1,
        }
        : {};

    const handleClick = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            // eslint-disable-next-line
            const response = await axios.post('/auth/register-user', {email,password,username})
            navigate(`/`);
        }catch(error){
            console.log(error);
            setLoading(false);
            if(error?.response?.data?.message){
                setpopUpText(error?.response?.data?.message);
            }
            else{
                setpopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        }
    }
    return (
        <div className="login-container">
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <div className="login-box">
                <h1 className="login-title">Join Our Community</h1>
                <p className="login-motivation">
                    Become a part of the revolution in car management. Start optimizing your automotive operations today.
                </p>
                <form className="login-form">
                    <div className="input-group">
                        <input 
                            type="text" 
                            id="fullname" 
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            required />
                        <label htmlFor="fullname">Full Name</label>
                    </div>
                    <div className="input-group">
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            required />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password" 
                            required />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="input-group">
                        <input type="password" id="confirm-password" required />
                        <label htmlFor="confirm-password">Confirm Password</label>
                    </div>
                    <button 
                        type="submit"
                        onClick={handleClick}
                        >Register</button>
                </form>
                <div className="alternate-action">
                    Don't have an account? <Link to="/">Login</Link>
                </div>
            </div>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </div>
    );
};

export default Register;
