import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);

  // Links for everyone
  const navLinks = [
    { name: "Home", path: "/" },
  ];

  // Links only for logged in users
  const authLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Accounts", path: "/create-account" },
    { name: "Transfer", path: "/transfer" },
    { name: "History", path: "/history" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  }

  const linksToDisplay = user ? [...navLinks, ...authLinks] : navLinks;

  return (
    <nav className="sticky top-0 z-50 glass border-b-0 border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          NexusBank
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {linksToDisplay.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                location.pathname === link.path ? "text-blue-400" : "text-slate-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 ml-4">
            {loading ? (
               <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex justify-center items-center text-white font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors duration-300 ml-2 border border-slate-700/50 hover:border-red-500/30 px-4 py-1.5 rounded-full"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transform hover:-translate-y-0.5"
                >
                  Open Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;