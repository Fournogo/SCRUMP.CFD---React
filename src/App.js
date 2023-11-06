import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Navigation from './pages/Navigation';
import Weather from './pages/Weather';
import { AudioProvider } from './contexts/AudioContext';
import './App.css';

function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/weather.html" element={<Navigate to="/weather" />} />
        <Route path="/weather" element={<Navigation />} />
        <Route path="/weather/:regionName" element={<Weather />} />
      </Routes>
      </BrowserRouter>
    </AudioProvider>
  );
}

export default App;