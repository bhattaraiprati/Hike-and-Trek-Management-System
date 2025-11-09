import axios from "axios"
import { urlLink } from "../axiosConfig"

interface LoginData{
    email: String,
    password: String
}
interface RegisterForm{
    name: String,
    email: String,
    password: String
}

export const  loginForm = async (data: LoginData)=>{
    const response = await axios.post(`${urlLink}/api/auth/login`, data);
    return response.data;
}

export const registerForm = async (registerData: RegisterForm) =>{
    const response = await axios.post(`${urlLink}/api/auth/register`, registerData);
    return response.data;
}