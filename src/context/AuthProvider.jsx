import axios from 'axios'
import React, { createContext, useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
const Auth =createContext()
export const UseAuth=()=>useContext(Auth)

const AuthProvider = ({children}) => {
    const[loading,setloading]=useState(false)
    
    const navigate=useNavigate()
    const [userdata,setuserdata]=useState(()=>JSON.parse(localStorage.getItem("userdata"))||null)
    const[isallowed,setisallowed]=useState(!!userdata)

    const login= async(userdata)=>{
        try{
            setloading(true)
        const response=await axios.post("http://localhost:8000/api/token/",userdata);
        toast.success("login successfully")
       
        setisallowed(true)
        localStorage.setItem("access",response.data.access)
        localStorage.setItem("refresh",response.data.refresh)
        localStorage.setItem("userdata",JSON.stringify(userdata))
        setuserdata(userdata)
        navigate("/our-services")
        }catch(error){
            toast.error(error.response?.data?.detail)
            console.log(error)
        }finally{
            setloading(false)
        }

    }
    const logout=()=>{
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("userdata")

        setuserdata(null)
        setisallowed(false)
        
     navigate('/')
    }

  return (
   <Auth.Provider value={{isallowed,setisallowed,login,logout,loading,setloading,userdata}}>
    {children}
   </Auth.Provider>
  )
}

export default AuthProvider
