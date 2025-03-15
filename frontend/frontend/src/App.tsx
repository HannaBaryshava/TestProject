import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import UserForm from './components/UserForm';
import UserResult from './components/UserResult';
import './App.css';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> | <Link to="/new">Create user</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<UserForm />} />
                <Route path="/result" element={<UserResult />} />
            </Routes>
        </Router>
    );
}

export default App;