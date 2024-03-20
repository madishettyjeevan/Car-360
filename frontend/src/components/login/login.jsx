// src/components/Login.js
import React,{useState} from 'react';
import './login.css';
import {useNavigate,Link} from 'react-router-dom';

import axios from '../../axios';

import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';


const Login = () => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setpopUpText] = useState("")
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
            const response = await axios.post('/auth/login-admin', {email,password})
            navigate(`/dashboard/${response.data.user.username}`);
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
                {/* Catchy Heading */}
                <h1 className="login-title">Rev Up Your Management</h1>
                {/* Motivational Text */}
                <p className="login-motivation">
                    Streamline your automotive operations with precision. Sign in to take control of your inventory like never before.
                </p>
                <form className="login-form">
                    <div className="input-group">
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e)=>setemail(e.target.value)}
                            required />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required />
                        <label htmlFor="password">Password</label>
                    </div>
                    <button type="submit" onClick={handleClick}>Sign In</button>
                </form>
                <div className="alternate-action">
                    Don't have an account? <Link to="/signup">Sign up</Link>
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

export default Login;
