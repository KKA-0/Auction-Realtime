import Navbar from "./widgets/navbar"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import Signup from "./pages/signup"
import Home from "./home";

function App() {

  return (
    <>
      <BrowserRouter>
      <div className="App">
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
