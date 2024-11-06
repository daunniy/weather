import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WeatherPage from './pages/WeatherPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/:city" element={<WeatherPage/>} />
      </Routes>
    </div>
  );
}

export default App;
