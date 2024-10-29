import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SocketProvider } from './Socket';
import ManageFuel from './components/managefuel';
import Restock from './components/restockrequests';
import Home from './components/Homepage';
import DownloadMetrics from './components/dwnld';
import './App.css';

const App = () => {
    return (
        <SocketProvider>
            <Router>
                <div>
                    <center>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/manage-fuel">Manage Fuel</Link>
                        <Link to="/restock-requests">RestockRequests</Link>
                        <Link to="/download-metrics">DownloadMetrics</Link>
                    </nav>
                    <Routes className="routes">
                        <Route path="/" element={<Home />} />
                        <Route path="/manage-fuel" element={<ManageFuel />} />
                        <Route path="/restock-requests" element={<Restock />} />
                        <Route path="/download-metrics" element={<DownloadMetrics/>} />
                    </Routes>
                    </center>
                </div>
            </Router>
        </SocketProvider>
    );
};

export default App;
