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
      <div>
        {showRegister ? (
          <>
            <Register />
            <p>
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)}>
                Login
              </button>
            </p>
          </>
        ) : (
          <>
            <Login setIsLoggedIn={setIsLoggedIn} />
            <p>
              Don’t have an account?{" "}
              <button onClick={() => setShowRegister(true)}>
                Register
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <UserCrud />
    </div>
  );
}

export default App;