import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ServerList from './components/ServerList';
import ServerPanel from './pages/ServerPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen body-bg">
          <ul className="flex space-x-4">
          </ul>
        <div className="p-4">
          <Routes>
            <Route path="/server/:serverName" element={<ServerPanel />} />
            <Route path="/" element={<ServerList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
