import React,{useEffect,useState} from 'react';
import './viewCar.css'; 
import axios from '../../axios';



const ViewCars = () => {
    const [cars, setCars] = useState([]);
    useEffect(() => {
        const fetchBooks = async () => {
            try{
                const res = await axios.get("/admin/get-cars");
                setCars(res.data);
                console.log(res.data)
            }catch(error){
                console.log(error);
            }
        }
        fetchBooks();
    })
    return (
        <div className="cars-container">
            {cars&&cars.map((car) => (
                <div key={car.id} className="car-card">
                    <img src={car.image} alt={`${car.brand} ${car.model}`} />
                    <div className="car-info">
                        <h3>{car.brand} {car.model}</h3>
                        <p>Year: {car.year}</p>
                        <p>Price: ${car.price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ViewCars;
