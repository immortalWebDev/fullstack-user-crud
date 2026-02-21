import { useState, useEffect } from "react";
import "./App.css";
import UserCrud from "./components/UserCrud";
import Login from "./components/Login";
import Register from "./components/Signup";

// const API = `http://localhost:3000`
const API = `https://fullstack-user-crud-production.up.railway.app`

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          method: "GET",
          credentials: "include"
        });

        

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔓 Logout
  const handleLogout = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });

    setIsLoggedIn(false);
  };

  // ⏳ Prevent UI flash before auth check finishes
  if (loading) {
    return <div>Loading...</div>;
  }

 if (!isLoggedIn) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">
          {showRegister ? "Create Account" : "Welcome Back"}
        </h2>

        {showRegister ? (
          <>
            <Register />
            <p className="auth-toggle">
              Already have an account?{" "}
              <span onClick={() => setShowRegister(false)}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <Login setIsLoggedIn={setIsLoggedIn} />
            <p className="auth-toggle">
              Don’t have an account?{" "}
              <span onClick={() => setShowRegister(true)}>
                Register
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
 return (
  <div className="app-container">
    <header className="app-header">
      <h2>Admin Dashboard</h2>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>

    <UserCrud />
  </div>
);
}

export default App;