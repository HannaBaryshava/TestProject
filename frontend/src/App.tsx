import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home.tsx';
import UserForm from './components/pages/UserForm.tsx';
import UserResult from './components/pages/UserResult.tsx';
import Navigation from './components/ui/Navigation.tsx';
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