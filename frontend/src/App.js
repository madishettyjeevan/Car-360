import './App.css';
import {  Routes, Route } from 'react-router-dom';

import Login from './components/login/login';
import Signupp from './components/signup/signup';
import Dashboard from './components/dashboard/dashboard';
import AddCar from './components/addCar/addCar';
import ViewCars from './components/viewCar/viewCar';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signupp />} />
      <Route path="/dashboard/:userName" element={<Dashboard />} />
      <Route path="/add-car/:userName" element={<AddCar />} />
      <Route path="/view-cars/:userName" element={<ViewCars />} />
    </Routes>
  );
}

export default App;
