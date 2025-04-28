import {Link} from 'react-router-dom';

const navigateButton = "text-orange-400 hover:text-orange-500";

const Navigation = () => {
    return (
        <nav className="p-4">
            <Link to="/" className={navigateButton}>Home</Link>
            {' | '}
            <Link to="/new" className={navigateButton}>Create user</Link>
        </nav>
    );
};

export default Navigation;