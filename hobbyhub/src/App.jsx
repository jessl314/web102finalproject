import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css'
import Home from "./pages/Home.jsx"
import CreatePost from './pages/CreatePost.jsx'
import NavBar from './components/NavBar.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/create" element={<CreatePost />}/>
          {/* <Route path="/post/:id" element={<Post/>}/> */}
        </Routes>
    </Router>
  )
}

export default App
