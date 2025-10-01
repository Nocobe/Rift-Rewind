import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import PlayerDetails from './pages/PlayerDetails';

function App() {
  return (
    <div className="App">
      <nav className="TopNav">
        <div className="Brand">Rift Rewind</div>
        <div className="Links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>
      <main className="MainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/player/:id" element={<PlayerDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
