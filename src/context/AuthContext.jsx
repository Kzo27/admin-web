// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Make sure this path is correct

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // This effect automatically fetches user data if a token exists.
  // It runs when the app first loads and any time the token changes.
  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        try {
          // The request interceptor in api.js will add the token to the header
          const userResponse = await api.get("/api/v1/auth/me");
          setUser(userResponse.data.data);
        } catch (error) {
          // This likely means the token is invalid or expired
          console.error("Invalid session token, logging out.", error);
          // Use the logout function to clear state and redirect
          logout();
        }
      }
    };

    fetchUserOnLoad();
  }, [token]); // Dependency array ensures this runs when the token state changes

  const login = async (email, password) => {
    try {
      // Use the full API path
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });
      const { token } = response.data;

      setToken(token);
      localStorage.setItem("token", token);

      // Fetch user data immediately after login
      // The `useEffect` above will also run, but this provides instant feedback
      const userResponse = await api.get("/api/v1/auth/me");
      setUser(userResponse.data.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    // Navigate to the login page after state has been cleared
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
