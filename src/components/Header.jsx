import { useState } from "react";
import { LOGO_URL, LOGO_URL_DARK } from "../../utils/constants";

const Header = () => {
    const [btnNameReact, setBtnNameReact] = useState("Login");
    const [darkMode, setDarkMode] = useState(false); // ⬅️ Dark mode toggle

    const logoSrc = darkMode ? LOGO_URL_DARK : LOGO_URL;

    return (
        <div className={`header ${darkMode ? "dark" : "light"}`}>
            <div className="logo-container">
                <img
                    className="logo"
                    src={logoSrc}
                    alt="Biolift Logo"
                />
            </div>

            <div className="nav-items">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#cart">Cart</a></li>
                    <li><a href="#contact">Contact</a></li>

                    <button 
                        className='login'
                        onClick={() => {
                            setBtnNameReact(btnNameReact === "Login" ? "Logout" : "Login");
                        }}>
                        {btnNameReact}
                    </button> 

                    <button 
                        className="dark-toggle"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "🌞 Light" : "🌙 Dark"}
                    </button>
                </ul>
            </div>
            
        </div>
    );
};

export default Header;
