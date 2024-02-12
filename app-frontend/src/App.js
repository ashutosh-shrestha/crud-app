import React from 'react';
import Home from './Components/Home/home';
import Navbar from './Components/Navbar/navbar';
import Client from './Components/Client/client';
import Contact from './Components/Contact/contact';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/clients" element={<Client />} />

          <Route path="/contacts" element={<Contact />} />

          {/* 👇️ only match this when no other routes match */}
          <Route
            path="*"
            element={
              <div>
                <h2>404 Page not found</h2>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
