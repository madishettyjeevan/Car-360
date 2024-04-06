import { createContext } from "react";


const initialUserValue = {
    username:"",
    email: "",
    userId:"",
    isLoggedIn: false 
}

export const UserContext = createContext(initialUserValue);