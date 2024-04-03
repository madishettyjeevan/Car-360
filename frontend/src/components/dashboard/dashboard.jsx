import React from 'react';
import './dashbaord.css'; 

import {useNavigate,useParams} from 'react-router-dom';

const Dashboard = () => {

    const {userName} = useParams();
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard {userName}!! </h1>
            <div className="management-options">
                <div className="option" onClick={() => {/* Navigate to Car Inventory */}}>
                    <h2>Car Inventory</h2>
                    <div className="sub-options">
                        <button onClick={() => {navigate(`/add-car/${userName}`)}}>Add Car</button>
                        <button onClick={() => {navigate(`/view-cars/${userName}`)}}>View Inventory</button>
                    </div>
                </div>
                <div className="option" onClick={() => {/* Navigate to Sales Management */}}>
                    <h2>Sales Management</h2>
                    <div className="sub-options">
                        <button onClick={() => {/* Navigate to Add Car */}}>View metrics</button>
                        <button onClick={() => {/* Navigate to View Inventory */}}>Sales</button>
                    </div>
                    {/* Implement Sales Management Navigation */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
