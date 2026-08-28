import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";   
import Search from "./Pages/Search";
import Home from "./Pages/Home";
import LanguageProvider from "./i18n/LanguageProvider";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/Pages/Home" element={<Home />} />
          <Route path="/Pages/Search" element={<Search />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
