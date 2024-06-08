// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";

import Register from "./components/Register.js";
import Login from "./components/Login.js";
import AddPassword from "./components/AddPassword.js";
import YourPasswords from "./components/YourPassword.js";

function App() {
  const [token, setToken] = useState("");

  const logout = () => {
    // Limpiar el token de autenticación
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <h1 className="text-3xl font-bold underline mb-8">Password Manager</h1>
        <nav className="mb-8">
          {token ? (
            <>
              <Link
                to="/add-password"
                className="text-indigo-600 hover:text-indigo-800 mx-2"
              >
                Add Password
              </Link>
              <span>|</span>
              <Link
                to="/view-passwords"
                className="text-indigo-600 hover:text-indigo-800 mx-2"
              >
                View Passwords
              </Link>
              <span>|</span>
              <button
                onClick={logout}
                className="text-indigo-600 hover:text-indigo-800 mx-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 mx-2"
              >
                Register
              </Link>
              <span>|</span>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-800 mx-2"
              >
                Login
              </Link>
            </>
          )}
        </nav>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <Routes>
            <Route exact path="/" element={<Register />} />
            <Route
              path="/login"
              element={
                token ? (
                  <Navigate to="/view-passwords" />
                ) : (
                  <Login setToken={setToken} />
                )
              }
            />
            <Route
              path="/add-password"
              element={
                token ? <AddPassword token={token} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/view-passwords"
              element={
                token ? (
                  <YourPasswords token={token} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
