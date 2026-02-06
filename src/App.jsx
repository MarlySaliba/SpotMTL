import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";   
import Search from "./Pages/Search";
import Home from "./Pages/Home";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Pages/Home" element={<Home />} />
        <Route path="/Pages/Search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
