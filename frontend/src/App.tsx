import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import UserForm from './components/UserForm';
import UserResult from './components/UserResult';
import './App.css';

const Navigation = () => {
    const location = useLocation();

    return (
        <nav className="p-4">
            {location.pathname !== '/' && (
                <Link to="/" className="text-orange-400 hover:text-orange-500">Home</Link>
            )}
            {location.pathname !== '/' && ' | '}
            <Link to="/new" className="text-orange-400 hover:text-orange-500">Create user</Link>
        </nav>
    );
};


function App() {
    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<UserForm />} />
                <Route path="/result" element={<UserResult />} />
            </Routes>
        </Router>
    );
}

export default App;