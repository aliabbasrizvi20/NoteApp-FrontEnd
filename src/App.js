import './style.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ToDoApp from './Components/ToDo/ToDoApp'

import DeletedNotes from './Components/ToDo/DeletedNotes'
import Signup from './Singup/Signup'
import Logins from './Logins/Logins'

export default function MyApp() {
  return (
    <>
    
    <BrowserRouter>
    <Routes>
        <Route path='/todo' element={<ToDoApp/>}/>
     
            <Route path='/DeletedNotes' element={<DeletedNotes/>}/>
       <Route path="/signup" element={<Signup />} />
       <Route path='/login' element ={<Logins/>}/>
     
    </Routes>
    </BrowserRouter>


    
      
    </>
  )
}