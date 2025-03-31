import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import UserForm from './components/UserForm';
import UserResult from './components/UserResult';
import Navigation from './components/Navigation';
import './App.css';
import { UserProvider } from './context/UserContext';

function App() {
    return (
        <UserProvider>
        <Router>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<UserForm />} />
                <Route path="/result" element={<UserResult />} />
            </Routes>
        </Router>
        </UserProvider>
    );
}

export default App;