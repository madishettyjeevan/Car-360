import React,{useState} from 'react';
import './addCar.css';
import { useNavigate,useParams } from 'react-router-dom';
import axios from '../../axios';

import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

const AddCar = () => {

    const {userName} = useParams();

    const navigate = useNavigate();
    const [brand, setbrand] = useState('');
    const [model, setmodel] = useState('');
    const [year, setyear] = useState('');
    const [color, setcolor] = useState('');
    const [price, setprice] = useState('');
    const [description, setdescription] = useState('');
    const [stock, setstock] = useState('');
    const [image, setimage] = useState('');


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

    const handleSubmit = async(e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('year', year);
        formData.append('color', color);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('carImage', image);
        console.log(image)
        try{
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            setLoading(true);
            const response = await axios.post(`/admin/add-car/${brand}/${model}`, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setpopUpText("Car Added Successfully");
            setIsPopUpOpen(true);
            setLoading(false);
            setbrand('');
            setmodel('');
            setyear('');
            setcolor('');
            setprice('');
            setdescription('');
            setstock('');
            setimage('');
        }catch(error){
            console.log(error);
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
    };

    


    

    return (
        <div className="add-car-container">
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <div className="form-navigation">
                <button onClick={() => navigate(-1)} className="nav-button">Back</button>
                <button onClick={() => navigate(`/view-cars/${userName}`)} className="nav-button">View Cars</button>
            </div>
            <div className="add-car-sub-container">
                <h2>Add New Car to Inventory</h2>
                <form className="add-car-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="brand">Brand</label>
                        <input 
                            type="text" 
                            id="brand" 
                            value={brand}
                            onChange={(e) => setbrand(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="model">Model</label>
                        <input 
                            type="text" 
                            id="model" 
                            value={model}
                            onChange={(e) => setmodel(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="color">color</label>
                        <input 
                            type="text" 
                            id="color" 
                            value={color}
                            onChange={(e) => setcolor(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <input 
                            type="number" 
                            id="year"
                            value={year}
                            onChange={(e) => setyear(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input 
                            type="text" 
                            value={price}
                            onChange={(e) => setprice(e.target.value)}
                            id="price" 
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input 
                            type="text" 
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                            id="description" 
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input 
                            type="text" 
                            id="stock" 
                            value={stock}
                            onChange={(e) => setstock(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Car Image</label>
                        <input 
                            type="file" 
                            id="image" 
                            onChange={(e) => setimage(e.target.files[0])}
                            accept="image/*" />
                    </div>
                    
                    <button type="submit">Add Car</button>
                </form>
            </div>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </div>
    );
};

export default AddCar;
