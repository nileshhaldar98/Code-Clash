import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from

const App = () => {
  return (
    <div className="flex flex-col items-centerjustify-start">
      <Routes>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/SignUp' element={<SignUpPage/>} />
        <Route path='/' element={<HomePage/>} />
      </Routes>
    </div>
  )
}

export default App