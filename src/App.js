import './style.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import Signup from './Singup/Signup'
import Logins from './Logins/Logins'
import ToDoApp from './Components/ToDo/ToDoApp'

export default function MyApp() {
  return (
    <>
    
    <BrowserRouter>
    <Routes>

        <Route path='/' element={<ToDoApp/>}/>
       <Route path="/signup" element={<Signup />} />
       <Route path='/login' element ={<Logins/>}/>
     
    </Routes>
    </BrowserRouter>


    
      
    </>
  )
}